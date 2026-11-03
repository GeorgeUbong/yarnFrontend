"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuth } from "../Context/authContext";
import { Button } from "../components/button";
import { PostCard } from "../components/post-card";
import {
  getOwnPosts,
  updateProfileImage,
  updateUsername,
  type Post,
} from "../_utils/_apis/app.routes";
import { ApiError } from "../_utils/_apis/api-client";
import { FeedLoader } from "../components/feed-loader";
import { toast } from "react-toastify";

function messageFor(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong, try again.";
}

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState(user?.username ?? "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPostsError, setHasPostsError] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [retryPosts, setRetryPosts] = useState(0);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const userId = user?.id;
  useEffect(() => {
    if (userId === undefined) return;
    let active = true;
    getOwnPosts()
      .then((result) => {
        if (active) {
          setPosts(result);
          setHasPostsError(false);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setHasPostsError(true);
          toast.error(messageFor(error));
        }
      })
      .finally(() => {
        if (active) setIsLoadingPosts(false);
      });

    return () => {
      active = false;
    };
  }, [userId, retryPosts]);

  async function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("The image must be 5 MB or smaller.");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSaveUsername() {
    if (!user) return;
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error("Username cannot be empty.");
      return;
    }
    if (trimmed === user.username) return;

    setIsSavingName(true);
    try {
      const updatedUser = await updateUsername({ username: trimmed });
      setUser(updatedUser);
      setUsername(updatedUser.username);
      toast.success("Username updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof ApiError && error.fieldErrors?.username
          ? error.fieldErrors.username
          : messageFor(error),
      );
    } finally {
      setIsSavingName(false);
    }
  }

  async function handleSaveImage() {
    if (!selectedImage) return;
    setIsSavingImage(true);
    try {
      const updatedUser = await updateProfileImage(selectedImage);
      setUser(updatedUser);
      setSelectedImage(null);
      setPreviewUrl(null);
      toast.success("Profile photo updated successfully.");
    } catch (error) {
      toast.error(messageFor(error));
    } finally {
      setIsSavingImage(false);
    }
  }

  function handleCancelImage() {
    if (isSavingImage) return;
    setSelectedImage(null);
    setPreviewUrl(null);
  }

  const trimmedUsername = username.trim();
  const canSaveUsername =
    Boolean(trimmedUsername) &&
    trimmedUsername !== user?.username &&
    !isSavingName;

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:min-h-0 lg:overscroll-contain">
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Settings
      </Typography>

      {user && (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={3}>
              <Typography component="h2" variant="h6">
                Profile
              </Typography>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar
                  src={previewUrl ?? user.profileImage ?? undefined}
                  alt={user.username}
                  sx={{ width: 80, height: 80 }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectImage}
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInput.current?.click()}
                  disabled={isSavingImage}
                >
                  Change photo
                </Button>
                {selectedImage && (
                  <>
                    <Button
                      onClick={() => void handleSaveImage()}
                      disabled={isSavingImage}
                      isLoading={isSavingImage}
                    >
                      Save photo
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelImage}
                      disabled={isSavingImage}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <TextField
                  label="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  fullWidth
                  disabled={isSavingName}
                />
                <Button
                  onClick={() => void handleSaveUsername()}
                  disabled={!canSaveUsername}
                  isLoading={isSavingName}
                >
                  Save
                </Button>
              </div>
            </Stack>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="your-posts-heading">
        <Typography
          id="your-posts-heading"
          component="h2"
          variant="h6"
          className="mb-3"
        >
          Your posts
        </Typography>
        {user && (
          <>
            {hasPostsError && (
              <Button
                variant="outlined"
                onClick={() => {
                  setIsLoadingPosts(true);
                  setHasPostsError(false);
                  setRetryPosts((value) => value + 1);
                }}
              >
                Retry loading your posts
              </Button>
            )}
            {isLoadingPosts ? (
              <Stack spacing={2}>
                {[0, 1, 2].map((item) => (
                  <Card key={item} variant="outlined">
                    <CardContent>
                      <Skeleton width="35%" />
                      <Skeleton />
                      <Skeleton width="70%" />
                    </CardContent>
                  </Card>
                ))}
                <FeedLoader label="Loading your posts" />
              </Stack>
            ) : hasPostsError ? null : posts.length ? (
              <Stack spacing={2}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDeleted={(id) =>
                      setPosts((current) =>
                        current.filter((item) => item.id !== id),
                      )
                    }
                  />
                ))}
              </Stack>
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary">
                    You haven&apos;t posted yet.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      
    </main>
  );
}
