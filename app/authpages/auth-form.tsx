"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import { Button } from "../components/button";
import { login, signup } from "../_utils/_apis/auth.routes";
import { ApiError } from "../_utils/_apis/api-client";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";

type AuthMode = "login" | "signup";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (cooldown <= 0) return;
    const timeout = window.setTimeout(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [cooldown]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isSignup) {
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await (isSignup
        ? signup({
            username: String(formData.get("username") ?? "").trim(),
            email,
            password,
          })
        : login({ email, password }));
      setUser(response.user);
      toast.success(isSignup ? "Account created successfully." : "Logged in successfully.");
      router.replace("/feed");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        if (error.status === 429) setCooldown(10);
      } else {
        toast.error("Something went wrong, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <Box
        component="section"
        aria-label="Welcome to YarnNaija"
        className="relative hidden min-h-[320px] w-full flex-col justify-center overflow-hidden px-6 py-14 sm:px-12 lg:flex lg:min-h-screen lg:w-1/2 lg:px-11 xl:px-16"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
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
            <g stroke="currentColor" strokeWidth="2">
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
                  border: "2px solid",
                  borderColor: "primary.contrastText",
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
      >
        <Box className="mx-auto w-full max-w-[402px]">
          <Typography
            component="h2"
            sx={{
              color: "primary.main",
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

          <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={2.5}
          >
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
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa-solid fa-envelope" aria-hidden="true" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 },
                },
              }}
              sx={fieldSx}
            />

            <TextField
              aria-label="Password"
              placeholder={isSignup ? "Create password" : "Enter password"}
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              variant="outlined"
              fullWidth
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { "aria-label": "Password" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fa-solid fa-lock" aria-hidden="true" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        onClick={() =>
                          setIsPasswordVisible((visible) => !visible)
                        }
                        edge="end"
                        disabled={isSubmitting}
                      >
                        <i
                          className={`fa-solid ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
                          aria-hidden="true"
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 },
                },
              }}
              sx={fieldSx}
            />

            {isSignup && (
              <TextField
                aria-label="Confirm password"
                name="confirmPassword"
                placeholder="Confirm password"
                type={isConfirmPasswordVisible ? "text" : "password"}
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                required
                disabled={isSubmitting}
                slotProps={{
                  htmlInput: { "aria-label": "Confirm password" },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa-solid fa-lock" aria-hidden="true" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            isConfirmPasswordVisible
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                          onClick={() =>
                            setIsConfirmPasswordVisible((visible) => !visible)
                          }
                          edge="end"
                          disabled={isSubmitting}
                        >
                          <i
                            className={`fa-solid ${isConfirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
                            aria-hidden="true"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 1.5 },
                  },
                }}
                sx={fieldSx}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting || cooldown > 0}
              isLoading={isSubmitting}
              sx={{
                mt: 2,
                minHeight: 52,
                borderRadius: 1.5,
              }}
            >
              {isSubmitting
                ? isSignup
                  ? "Creating account..."
                  : "Logging in..."
                : cooldown > 0
                  ? `Try again in ${cooldown}s`
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
            <MuiLink
              component={Link}
                    href={
                      isSignup
                        ? "/authpages/loginpage"
                        : "/authpages/signuppage"
                    }
              color="primary"
              className="font-semibold underline-offset-4 hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
