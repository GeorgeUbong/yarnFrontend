"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MuiButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutline from "@mui/icons-material/DeleteOutlineOutlined";

import { useAuth } from "../Context/authContext";
import { deletePost, type Post } from "../_utils/_apis/app.routes";
import { ApiError } from "../_utils/_apis/api-client";
import { Button } from "./button";
import { toast } from "react-toastify";

export function PostCard({
  post,
  onDeleted,
}: {
  post: Post;
  onDeleted: (id: string) => void;
}) {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const isOwnPost = user?.id === post.authorId;
  const authorName =
    isOwnPost && user ? user.username : post.author.username;
  const authorImage =
    post.author.profileImage ??
    (isOwnPost ? user?.profileImage ?? undefined : undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, 0);
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onDeleted(post.id);
      toast.success("Post deleted.");
      setDialogOpen(false);
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError
          ? requestError.message
          : "Something went wrong, try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const postedAt = new Date(post.postedAt);
  const elapsedMilliseconds =
    currentTime === null ? 0 : currentTime - postedAt.getTime();
  const elapsedHours = elapsedMilliseconds / (60 * 60 * 1000);
  const postedAtLabel = Number.isNaN(postedAt.getTime())
    ? post.postedAt
    : currentTime === null
      ? postedAt.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
    : elapsedHours < 6
      ? postedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : elapsedHours < 24
        ? `${Math.floor(elapsedHours)} ${Math.floor(elapsedHours) === 1 ? "hour" : "hours"} ago`
        : postedAt.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <div className="mb-3 flex items-center gap-3">
            <Avatar src={authorImage}>
              {authorName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="min-w-0 flex-1">
              <Typography className="font-semibold">{authorName}</Typography>
              <Typography
                component="time"
                dateTime={post.postedAt}
                variant="caption"
                color="text.secondary"
              >
                {postedAtLabel}
              </Typography>
            </div>
            {isOwnPost && (
              <IconButton
                aria-label="Delete post"
                color="error"
                onClick={() => setDialogOpen(true)}
                disabled={isDeleting}
              >
                <DeleteOutline />
              </IconButton>
            )}
          </div>
          <Typography className="whitespace-pre-wrap break-words">
            {post.content}
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!isDeleting) setDialogOpen(false);
        }}
        aria-labelledby={`delete-post-title-${post.id}`}
      >
        <DialogTitle id={`delete-post-title-${post.id}`}>
          Delete post?
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Delete this post? This can&apos;t be undone.
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <MuiButton
            variant="contained"
            color="error"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
