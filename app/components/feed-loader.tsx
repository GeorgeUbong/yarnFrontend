import CircularProgress from "@mui/material/CircularProgress";

export function FeedLoader({ label }: { label: string }) {
  return (
    <CircularProgress
      role="status"
      aria-label={label}
      color="primary"
    />
  );
}
