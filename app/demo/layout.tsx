import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Demo",
  description:
    "Try the BookSmart dashboard with sample data. See how bookings from Airbnb, GetYourGuide, Viator and more appear in one place with dietary notes and special requests.",
  openGraph: {
    title: "BookSmart Demo - See the dashboard in action",
    description:
      "Try the BookSmart dashboard with sample data. See how your bookings could look in one place.",
  },
  robots: { index: true, follow: true },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
