'use client';

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-error mb-2">Something went wrong!</h2>
      <p className="text-sm text-foreground/70 mb-4">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
