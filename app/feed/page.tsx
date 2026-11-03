"use client";

import { useEffect, useState, type FormEvent } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Button } from "../components/button";
import { PostCard } from "../components/post-card";
import { FeedLoader } from "../components/feed-loader";
import {
  createPost,
  getAllPosts,
  searchPosts,
  type Post,
} from "../_utils/_apis/app.routes";
import { ApiError } from "../_utils/_apis/api-client";
import { toast } from "react-toastify";

function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong, try again.";
}

const inputSx = {
  bgcolor: "background.paper",
  "& fieldset": { borderColor: "divider" },
  "&:hover fieldset": { borderColor: "primary.main" },
  "&.Mui-focused fieldset": { borderColor: "primary.main" },
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const trimmedQuery = query.trim();

    const timer = window.setTimeout(() => {
      const request = trimmedQuery
        ? searchPosts(trimmedQuery).then((result) => result.posts)
        : getAllPosts();

      request
        .then((result) => {
          if (isCurrent) setPosts(result);
        })
        .catch((requestError: unknown) => {
          if (isCurrent) {
            setLoadError(getErrorMessage(requestError));
            toast.error(getErrorMessage(requestError));
          }
        })
        .finally(() => {
          if (isCurrent) setIsLoading(false);
        });
    }, trimmedQuery ? 350 : 0);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [query, retry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Write something before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({ content: trimmedContent });
      setContent("");
      setIsPostModalOpen(false);
      toast.success("Post created successfully.");
      try {
        const trimmedQuery = query.trim();
        const refreshedPosts = trimmedQuery
          ? (await searchPosts(trimmedQuery)).posts
          : await getAllPosts();
        setPosts(refreshedPosts);
      } catch {
        toast.warn("Post created, but the feed could not be refreshed.");
      }
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function closePostModal() {
    if (!isSubmitting) setIsPostModalOpen(false);
  }

  // Shared by the desktop card and the mobile modal
  const postForm = (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <OutlinedInput
        multiline
        fullWidth
        minRows={4}
        maxRows={8}
        placeholder="What's on your mind?"
        inputProps={{ "aria-label": "Post content" }}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={isSubmitting}
        sx={inputSx}
      />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </Stack>
  );

  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:min-h-0">
      <h1 className="mb-4 text-2xl font-bold">Home</h1>

      {/* Search */}
      <div className="mb-6 sm:mb-8">
        <OutlinedInput
          fullWidth
          size="small"
          placeholder="Search posts"
          inputProps={{ "aria-label": "Search posts" }}
          value={query}
          onChange={(event) => {
            setIsLoading(true);
            setLoadError(null);
            setQuery(event.target.value);
          }}
          startAdornment={
            <InputAdornment position="start">
              <i
                className="fa-solid fa-magnifying-glass text-sm"
                aria-hidden="true"
              />
            </InputAdornment>
          }
          endAdornment={
            query ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={() => {
                    setIsLoading(true);
                    setLoadError(null);
                    setQuery("");
                  }}
                  edge="end"
                >
                  <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
                </IconButton>
              </InputAdornment>
            ) : null
          }
          sx={inputSx}
        />
      </div>

      <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6">
        {/* Posts (extra bottom padding on mobile so the button never covers content) */}
        <section
          aria-label="Posts"
          className="hide-scrollbar pb-24 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pb-0"
        >
          <Stack spacing={2}>
            {loadError ? (
              <Button
                variant="outlined"
                onClick={() => {
                  setIsLoading(true);
                  setLoadError(null);
                  setRetry((value) => value + 1);
                }}
              >
                Retry loading posts
              </Button>
            ) : isLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <FeedLoader
                  label={query.trim() ? "Searching posts" : "Loading posts"}
                />
              </div>
            ) : posts.length ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDeleted={(id) =>
                    setPosts((currentPosts) =>
                      currentPosts.filter((item) => item.id !== id),
                    )
                  }
                />
              ))
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary">
                    {query.trim()
                      ? "No posts match your search."
                      : "No posts yet. Be the first to share something."}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </section>

        {/* Desktop: sidebar post box */}
        <Card variant="outlined" className="hidden h-fit lg:block">
          <CardContent>
            <Typography component="h2" variant="h6" className="mb-4">
              Make a post
            </Typography>
            {postForm}
          </CardContent>
        </Card>
      </div>

      {/* Mobile: floating button that opens the post modal */}
      <div className="lg:hidden">
        <Fab
          variant="extended"
          color="primary"
          aria-label="Make a post"
          onClick={() => setIsPostModalOpen(true)}
          sx={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "calc(16px + env(safe-area-inset-bottom))",
            zIndex: (theme) => theme.zIndex.speedDial,
            textTransform: "none",
            fontWeight: 600,
            gap: 1,
            px: 3,
          }}
        >
          <i className="fa-solid fa-pen" aria-hidden="true" />
          Make a post
        </Fab>

        <Dialog
          open={isPostModalOpen}
          onClose={closePostModal}
          fullWidth
          maxWidth="sm"
          aria-labelledby="make-post-title"
        >
          <DialogTitle
            id="make-post-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Make a post
            <IconButton
              aria-label="Close"
              onClick={closePostModal}
              disabled={isSubmitting}
              edge="end"
              size="small"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="pt-1">{postForm}</div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}