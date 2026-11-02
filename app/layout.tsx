import type { Metadata } from "next";
import "./globals.css";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ChaosForge AI — Your chat. Their chaos.",
  description: "Turn Twitch chat into the show. An AI-powered live interaction engine for legendary streams.",
  applicationName: "ChaosForge AI",
  openGraph: {
    title: "ChaosForge AI — Your chat. Their chaos.",
    description: "Turn Twitch chat into the show with live, AI-powered stream events.",
    siteName: "ChaosForge AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ChaosForge AI — Your chat. Their chaos.",
    description: "Turn Twitch chat into the show with live, AI-powered stream events.",
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
