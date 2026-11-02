import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ChaosForge AI — Your chat. Their chaos.", description: "Turn Twitch chat into the show. An AI-powered live interaction engine for legendary streams." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
