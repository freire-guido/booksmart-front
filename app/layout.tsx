import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BookSmart - Turn Booking Chaos Into a Clear Schedule",
    template: "%s | BookSmart",
  },
  description:
    "BookSmart uses AI to parse your Gmail booking confirmations from Airbnb, GetYourGuide, Viator, and more. Keep your schedule live, accurate, and always up to date.",
  keywords: [
    "booking management",
    "tourism software",
    "travel agency",
    "Gmail integration",
    "AI scheduling",
    "Airbnb management",
    "GetYourGuide",
    "Viator",
  ],
  authors: [{ name: "BookSmart", url: baseUrl }],
  creator: "BookSmart",
  publisher: "BookSmart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // OG/Twitter image: same as favicon (app/icon.svg) for a single source of truth
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "BookSmart",
    title: "BookSmart - Focus on Your Guests, Not Your Inbox",
    description:
      "AI-powered booking management that reads your Gmail and keeps your schedule live and accurate.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "BookSmart - Booking management for tourism professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookSmart - Focus on Your Guests, Not Your Inbox",
    description:
      "AI-powered booking management that reads your Gmail and keeps your schedule live and accurate.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "technology",
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
      </body>
    </html>
  );
}
