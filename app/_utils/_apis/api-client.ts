import { z } from "zod";
import { redirectToLogin } from "../auth-session";

export const API_BASE = "/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const refreshResponseSchema = z.object({
  message: z.string().optional(),
});

let refreshInFlight: Promise<void> | null = null;

function validationFieldErrors(messages: string[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  const fields = ["username", "email", "password", "content", "image"];

  for (const message of messages) {
    const field = fields.find((candidate) =>
      new RegExp(`\\b${candidate}\\b`, "i").test(message),
    );
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}

function getValidationDetails(
  parsed: unknown,
  messages: string[],
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (typeof parsed === "object" && parsed !== null && "errors" in parsed) {
    const errors = parsed.errors;
    if (typeof errors === "object" && errors !== null) {
      for (const [field, value] of Object.entries(errors)) {
        const message = Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string").join(", ")
          : typeof value === "string"
            ? value
            : "";
        if (message) fieldErrors[field] = message;
      }
    }
  }
  return Object.keys(fieldErrors).length
    ? fieldErrors
    : validationFieldErrors(messages);
}

async function getErrorDetails(
  response: Response,
  path: string,
): Promise<{ message: string; fieldErrors?: Record<string, string> }> {
  const body = await response.text();
  let parsed: unknown;

  try {
    parsed = body ? JSON.parse(body) : undefined;
  } catch {
    parsed = undefined;
  }

  let messages: string[] = [];
  if (typeof parsed === "object" && parsed !== null && "message" in parsed) {
    const { message } = parsed;
    if (typeof message === "string" && message.trim()) {
      messages = [message];
    } else if (
      Array.isArray(message) &&
      message.every((item) => typeof item === "string")
    ) {
      messages = message;
    }
  }

  const validationErrors =
    response.status === 400 ? getValidationDetails(parsed, messages) : {};
  if (!messages.length) {
    messages = Object.values(validationErrors);
  }
  const fallbackMessage =
    messages.join(", ") ||
    body ||
    response.statusText ||
    "The server returned an empty error response.";
  const message =
    response.status === 401 && path.replace(/^\/+/, "") === "login"
      ? "Invalid email or password."
      : response.status === 409 && path.replace(/^\/+/, "") === "signup"
        ? "Email already in use."
        : response.status === 403
      ? "You don't have permission to do that."
      : response.status === 404
        ? "Not found."
        : response.status === 429
          ? "Too many requests. Please wait before trying again."
          : response.status >= 500
            ? "Something went wrong, try again."
            : fallbackMessage;

  return {
    message,
    ...(Object.keys(validationErrors).length
      ? { fieldErrors: validationErrors }
      : {}),
  };
}

function isAuthEndpoint(path: string): boolean {
  return ["login", "signup", "refresh"].includes(path.replace(/^\/+/, ""));
}

async function sendRequest(path: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Something went wrong, try again.");
  }
}

async function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = requestJson(
      "/refresh",
      { method: "POST" },
      refreshResponseSchema,
      "Refreshing session",
      false,
    )
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export async function requestJson<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
  action: string,
  retryUnauthorized = !isAuthEndpoint(path),
): Promise<T> {
  let response = await sendRequest(path, init);

  if (response.status === 401 && retryUnauthorized) {
    try {
      await refreshSession();
    } catch {
      redirectToLogin();
      throw new ApiError(401, "Your session has expired. Please log in again.");
    }
    response = await sendRequest(path, init);
  }

  if (!response.ok) {
    const details = await getErrorDetails(response, path);
    if (response.status === 401 && path.replace(/^\/+/, "") === "refresh") {
      redirectToLogin();
    }
    if (response.status === 401 && retryUnauthorized) {
      redirectToLogin();
    }
    throw new ApiError(
      response.status,
      details.message,
      details.fieldErrors,
    );
  }

  const responseText = await response.text();
  const responseBody: unknown = responseText
    ? JSON.parse(responseText)
    : undefined;
  return schema.parse(responseBody);
}
