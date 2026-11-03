
import type { Metadata } from "next";
import { jost, poppins } from "./theme/fonts";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "./Context/themeContext";
import { AuthProvider } from "./Context/authContext";
import { ToastProvider } from "./components/toast-provider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "YarnNaija | Everyone",
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
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <ToastProvider />
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
