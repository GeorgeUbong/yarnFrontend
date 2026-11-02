"use client";

import { useState, type FormEvent } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import { Button } from "./components/button";
import { signup } from "./_utils/_apis/auth.routes";
import { BRAND_COLORS } from "./theme/theme";

const brand = "#1b5e20";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signup({
        username: String(formData.get("username") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        password,
      });

      console.log("Signup response:", response);
      setFeedback({ type: "success", message: response.message });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.",
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
              <ellipse cx="150" cy="82" rx="53" ry="99" transform="rotate(60 150 150)" />
              <ellipse cx="150" cy="82" rx="53" ry="99" transform="rotate(120 150 150)" />
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
              <Avatar alt="YarnNaija community member" src="https://i.pravatar.cc/100?img=1" />
              <Avatar alt="YarnNaija community member" src="https://i.pravatar.cc/100?img=2" />
              <Avatar alt="YarnNaija community member" src="https://i.pravatar.cc/100?img=3" />
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
        aria-label="Create your account"
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
            Talk to anyone, talk to Everyone, yarn wetin dey your mind.
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 4 }}
          >
            Enter email
          </Typography>

          <Stack component="form" onSubmit={handleSignup} spacing={2.5}>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 52,
                  "& fieldset": { borderColor: brand },
                  "&:hover fieldset": { borderColor: brand },
                  "&.Mui-focused fieldset": { borderColor: brand },
                },
              }}
            />

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
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 52,
                  "& fieldset": { borderColor: brand },
                  "&:hover fieldset": { borderColor: brand },
                  "&.Mui-focused fieldset": { borderColor: brand },
                },
              }}
            />

            <TextField
              aria-label="Password"
              placeholder="Create password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              autoComplete="new-password"
              required
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { "aria-label": "Create password" },
                input: { sx: { borderRadius: 1.5 } },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 52,
                  "& fieldset": { borderColor: brand },
                  "&:hover fieldset": { borderColor: brand },
                  "&.Mui-focused fieldset": { borderColor: brand },
                },
              }}
            />

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
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 52,
                  "& fieldset": { borderColor: brand },
                  "&:hover fieldset": { borderColor: brand },
                  "&.Mui-focused fieldset": { borderColor: brand },
                },
              }}
            />

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
              {isSubmitting ? "Creating account..." : "SignUp"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </main>
  );
}
