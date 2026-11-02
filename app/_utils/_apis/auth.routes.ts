import { z } from "zod";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

const signupResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.email(),
  }),
  token: z.string(),
  refreshToken: z.string(),
});

const refreshTokenResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type LoginResponse = SignupResponse;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const HEAD = "/api/v1/";

export async function signup(input: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}${HEAD}signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Signup failed (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  const responseBody: unknown = await response.json();
  return signupResponseSchema.parse(responseBody);
}

export async function login(input: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${HEAD}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Login failed (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  const responseBody: unknown = await response.json();
  return signupResponseSchema.parse(responseBody);
}

export async function refreshAccessToken(
  input: RefreshTokenRequest,
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}${HEAD}refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Token refresh failed (${response.status}): ${errorBody || response.statusText}`,
    );
  }

  const responseBody: unknown = await response.json();
  return refreshTokenResponseSchema.parse(responseBody);
}
