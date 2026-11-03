import { FeedLoader } from "../components/feed-loader";

export default function FeedLoading() {
  return (
    <div
      className="flex min-h-[200px] items-center justify-center gap-3"
    >
      <FeedLoader label="Loading feed" />
      <span>Loading feed...</span>
    </div>
  );
}
