import type { ReactNode } from "react";
import FeedLayout from "../feed/layout";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <FeedLayout>{children}</FeedLayout>;
}
