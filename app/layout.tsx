import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BookSmart - Turn Booking Chaos Into a Clear Schedule",
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
  openGraph: {
    title: "BookSmart - Focus on Your Guests, Not Your Inbox",
    description:
      "AI-powered booking management that reads your Gmail and keeps your schedule live and accurate.",
    type: "website",
  },
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
      </body>
    </html>
  );
}
