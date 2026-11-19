import type { Metadata } from "next";
import { Inter_Tight, Montserrat } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell/Shell";
import { themeScript } from "@/components/shell/themeScript";

// Brand kit: Inter Tight for UI, Montserrat for the wordmark
const interTight = Inter_Tight({ variable: "--font-ui", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const montserrat = Montserrat({ variable: "--font-wordmark", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Convertleads Dashboard",
  description: "Marketing and operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${interTight.variable} ${montserrat.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased"><Shell>{children}</Shell></body>
    </html>
  );
}
