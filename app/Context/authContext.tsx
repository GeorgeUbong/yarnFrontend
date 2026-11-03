"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_SESSION_EXPIRED_EVENT,
} from "../_utils/auth-session";
import type { AuthUser } from "../_utils/auth-types";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const clearUser = useCallback(() => setUserState(null), []);
  const setUser = useCallback((nextUser: AuthUser) => {
    setUserState(nextUser);
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, clearUser);
    return () =>
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, clearUser);
  }, [clearUser]);

  const value = useMemo(
    () => ({ user, setUser, clearUser }),
    [user, setUser, clearUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
