"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import { Button } from "../components/button";
import { login, signup } from "../_utils/_apis/auth.routes";
import { BRAND_COLORS } from "../theme/theme";

type AuthMode = "login" | "signup";

const brand = "#1b5e20";
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    "& fieldset": { borderColor: brand },
    "&:hover fieldset": { borderColor: brand },
    "&.Mui-focused fieldset": { borderColor: brand },
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isSignup) {
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      if (password !== confirmPassword) {
        setFeedback({ type: "error", message: "Passwords do not match." });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = isSignup
        ? await signup({
            username: String(formData.get("username") ?? "").trim(),
            email,
            password,
          })
        : await login({ email, password });

      setFeedback({ type: "success", message: response.message });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : isSignup
              ? "Unable to create your account. Please try again."
              : "Unable to log in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <Box
        component="section"
        aria-label="Welcome to YarnNaija"
        className="relative hidden min-h-[320px] w-full flex-col justify-center overflow-hidden px-6 py-14 text-white sm:px-12 lg:flex lg:min-h-screen lg:w-1/2 lg:px-11 xl:px-16"
        sx={{
          background: "linear-gradient(125deg, #7ecb81 0%, #125900 78%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-32 opacity-[0.14] sm:-left-24 sm:-top-36"
        >
          <svg
            width="390"
            height="390"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="white" strokeWidth="2">
              <ellipse cx="150" cy="82" rx="53" ry="99" />
              <ellipse
                cx="150"
                cy="82"
                rx="53"
                ry="99"
                transform="rotate(60 150 150)"
              />
              <ellipse
                cx="150"
                cy="82"
                rx="53"
                ry="99"
                transform="rotate(120 150 150)"
              />
            </g>
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0">
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", xl: "2.75rem" },
              fontWeight: 300,
              lineHeight: 1.35,
              letterSpacing: "-0.03em",
            }}
          >
            Talk wetin dey your mind
            <br />
            To Everyone.
          </Typography>

          <div className="mt-7 flex items-center gap-4 sm:mt-8">
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: { xs: 32, sm: 38 },
                  height: { xs: 32, sm: 38 },
                  border: "2px solid rgba(255,255,255,0.65)",
                },
              }}
            >
              <Avatar
                alt="YarnNaija community member"
                src="https://i.pravatar.cc/100?img=1"
              />
              <Avatar
                alt="YarnNaija community member"
                src="https://i.pravatar.cc/100?img=2"
              />
              <Avatar
                alt="YarnNaija community member"
                src="https://i.pravatar.cc/100?img=3"
              />
            </AvatarGroup>

            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" }, opacity: 0.95 }}
            >
              Everyone is saying something, say something too.
            </Typography>
          </div>
        </div>
      </Box>

      <Box
        component="section"
        aria-label={isSignup ? "Create your account" : "Log in to your account"}
        className="flex min-h-[560px] w-full items-center justify-center px-6 py-14 sm:px-12 lg:min-h-screen lg:w-1/2 lg:px-10 xl:px-16"
        sx={{ backgroundColor: BRAND_COLORS[50] }}
      >
        <Box className="mx-auto w-full max-w-[402px]">
          <Typography
            component="h2"
            sx={{
              color: brand,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              fontWeight: 800,
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            {isSignup
              ? "Talk to anyone, talk to Everyone, yarn wetin dey your mind."
              : "Welcome back to YarnNaija."}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 4 }}
          >
            {isSignup ? "Enter your details to create an account." : "Log in with your email and password."}
          </Typography>

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            {isSignup && (
              <TextField
                aria-label="Username"
                name="username"
                placeholder="Choose a username"
                variant="outlined"
                fullWidth
                autoComplete="username"
                required
                disabled={isSubmitting}
                slotProps={{
                  htmlInput: { "aria-label": "Username" },
                  input: { sx: { borderRadius: 1.5 } },
                }}
                sx={fieldSx}
              />
            )}

            <TextField
              aria-label="Email address"
              name="email"
              placeholder="Enter email"
              variant="outlined"
              fullWidth
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { "aria-label": "Email address" },
                input: { sx: { borderRadius: 1.5 } },
              }}
              sx={fieldSx}
            />

            <TextField
              aria-label="Password"
              placeholder={isSignup ? "Create password" : "Enter password"}
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { "aria-label": "Password" },
                input: { sx: { borderRadius: 1.5 } },
              }}
              sx={fieldSx}
            />

            {isSignup && (
              <TextField
                aria-label="Confirm password"
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                required
                disabled={isSubmitting}
                slotProps={{
                  htmlInput: { "aria-label": "Confirm password" },
                  input: { sx: { borderRadius: 1.5 } },
                }}
                sx={fieldSx}
              />
            )}

            {feedback && (
              <Typography
                role={feedback.type === "error" ? "alert" : "status"}
                color={feedback.type === "error" ? "error" : "success.main"}
                variant="body2"
              >
                {feedback.message}
              </Typography>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              sx={{
                mt: 2,
                minHeight: 52,
                borderRadius: 1.5,
                bgcolor: brand,
                "&:hover": { bgcolor: "#154a19" },
              }}
            >
              {isSubmitting
                ? isSignup
                  ? "Creating account..."
                  : "Logging in..."
                : isSignup
                  ? "Sign up"
                  : "Log in"}
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 3, textAlign: "center" }}
          >
            {isSignup ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <Link
              href={
                isSignup ? "/authpages/loginpage" : "/authpages/signuppage"
              }
              className="font-semibold text-[#1b5e20] underline-offset-4 hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
