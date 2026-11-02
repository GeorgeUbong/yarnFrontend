
import type { Metadata } from "next";
import { jost, poppins } from "./theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signup | Everyone",
  description: "Talk to anyone, talk to everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${jost.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
