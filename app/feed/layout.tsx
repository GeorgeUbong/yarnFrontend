"use client";

import { useEffect, useState, type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import NavBar from "../components/navBar";
import { Button } from "../components/button";
import { ApiError } from "../_utils/_apis/api-client";
import { getCurrentUser } from "../_utils/_apis/app.routes";
import { useAuth } from "../Context/authContext";
import { FeedLoader } from "../components/feed-loader";
import { toast } from "react-toastify";

export default function FeedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, setUser } = useAuth();
  const [isChecking, setIsChecking] = useState(!user);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (user) return;
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          setHasValidSession(true);
        }
      })
      .catch((requestError: unknown) => {
        if (
          !active ||
          (requestError instanceof ApiError && requestError.status === 401)
        ) {
          return;
        }
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong, try again.";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [user, setUser, attempt]);

  let protectedContent = children;
  if (!user && !hasValidSession) {
    if (isChecking) {
      protectedContent = (
        <div className="flex flex-1 items-center justify-center">
          <FeedLoader label="Checking your session" />
        </div>
      );
    } else if (error) {
      protectedContent = (
        <Stack className="m-auto w-full max-w-lg p-6" spacing={2}>
          <Button
            onClick={() => {
              setIsChecking(true);
              setError(null);
              setAttempt((value) => value + 1);
            }}
          >
            Retry
          </Button>
        </Stack>
      );
    } else {
      protectedContent = null;
    }
  }

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <div className="shrink-0">
        <NavBar />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:min-h-0">
        {protectedContent}
      </div>
    </div>
  );
}
