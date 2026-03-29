import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reel Radar — Viral Trend Intelligence",
  description:
    "Discover trending Reels and TikTok formats in your niche. Get actionable intelligence on viral content trends.",
  openGraph: {
    title: "Reel Radar — Viral Trend Intelligence",
    description:
      "Discover trending Reels and TikTok formats in your niche.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
