export const AUTH_SESSION_EXPIRED_EVENT = "yarnnaija:auth-session-expired";

export function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    window.location.replace("/authpages/loginpage");
  }
}
