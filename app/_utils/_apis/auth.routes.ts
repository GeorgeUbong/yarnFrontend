import { z } from "zod";
import { requestJson } from "./api-client";
import type { AuthUser } from "../auth-types";

export { API_BASE_URL } from "./api-client";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const signupResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.email(),
    profileImage: z.string().nullable().optional(),
  }),
});

const refreshTokenResponseSchema = z.object({
  message: z.string().optional(),
});
const logoutResponseSchema = z.object({ message: z.string() });
export type SignupResponse = {
  message: string;
  user: AuthUser;
};
export type LoginResponse = SignupResponse;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export async function signup(input: SignupRequest): Promise<SignupResponse> {
  return requestJson(
    "/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    signupResponseSchema,
    "Signup",
    false,
  );
}

export async function login(input: LoginRequest): Promise<LoginResponse> {
  return requestJson(
    "/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    signupResponseSchema,
    "Login",
    false,
  );
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  return requestJson(
    "/refresh",
    { method: "POST" },
    refreshTokenResponseSchema,
    "Token refresh",
    false,
  );
}

export async function logout(): Promise<void> {
  await requestJson(
    "/logout",
    { method: "POST" },
    logoutResponseSchema,
    "Logout",
  );
}
