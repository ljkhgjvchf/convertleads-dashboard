import type { Metadata } from "next";
// Brand kit fonts, bundled (no Google Fonts fetch at build time): Inter Tight for UI, Montserrat for the wordmark
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { Shell } from "@/components/shell/Shell";
import { themeScript } from "@/components/shell/themeScript";

export const metadata: Metadata = {
  title: "Convertleads Dashboard",
  description: "Marketing and operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased"><Shell>{children}</Shell></body>
    </html>
  );
}
