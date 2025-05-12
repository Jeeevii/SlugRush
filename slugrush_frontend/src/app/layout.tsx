import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SlugRush - UCSC Gym Crowd Meter",
  description: "SlugRush helps UCSC students visualize gym crowd levels in real-time and track historical data to plan workouts better.",
  authors: [
    {
      name: "Jeevithan Mahenthran",
      url: "https://www.linkedin.com/in/jeevithan-mahenthran", 
    },
    {
      name: "Kevin Huang",
      url: "https://www.linkedin.com/in/hanlin-huang-6aa4131ba/", 
    },],
    icons: {
      icon: "icons/web-app-manifest-192x192.png", // Favicon for most browsers
      apple: "icons/apple-touch-icon.png", // Apple touch icon for iOS
      other: [
        { url: "icons/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "icons/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { url: "icons/favicon.ico", sizes: "any", type: "image/x-icon" },
      ],
    },
    manifest: "icons/site.webmanifest", // Web app manifest for PWA
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
