import React from 'react';

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="feed-layout w-full max-w-5xl mx-auto">{children}</div>;
}

