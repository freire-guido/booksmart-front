import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "BookSmart pricing: Free tier to get started, Plus and Pro for growing operations, Business for teams. Simple, transparent pricing for hospitality professionals.",
  openGraph: {
    title: "Pricing | BookSmart",
    description:
      "Simple pricing for booking management. Free to try, scale as you grow.",
  },
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    bookings: "10",
    bookingsPeriod: "/month",
    accounts: "1",
    description: "Try it free. No credit card required.",
    features: [
      "Gmail connection",
      "AI booking extraction",
      "Unified calendar view",
      "All supported platforms",
    ],
    cta: "Get started free",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Plus",
    price: "$19",
    period: "/month",
    bookings: "200",
    bookingsPeriod: "/month",
    accounts: "1",
    description: "More bookings, one inbox. Built for real operations.",
    features: [
      "Everything in Free",
      "200 bookings per month",
      "Priority support",
      "Export & reporting",
    ],
    cta: "Start Plus",
    ctaHref: "https://calendar.app.google/S5EC5XVDQoRn8BX4A",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    bookings: "1,000",
    bookingsPeriod: "/month",
    accounts: "3",
    description: "Scale without the chaos. Room to grow.",
    features: [
      "Everything in Plus",
      "1,000 bookings per month",
      "3 team accounts",
      "Advanced filters & views",
    ],
    cta: "Start Pro",
    ctaHref: "https://calendar.app.google/S5EC5XVDQoRn8BX4A",
    highlighted: false,
  },
  {
    name: "Business",
    price: "$49",
    priceNote: "+ $15/extra account",
    period: "/month",
    bookings: "Unlimited",
    bookingsPeriod: "",
    accounts: "Unlimited",
    description: "Unlimited scale. Full team, one dashboard.",
    features: [
      "Everything in Pro",
      "Unlimited bookings",
      "Unlimited team accounts",
      "Team management & roles",
      "Dedicated support",
    ],
    cta: "Contact sales",
    ctaHref: "https://calendar.app.google/S5EC5XVDQoRn8BX4A",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
            Pricing
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-foreground-muted">
            Start free. Upgrade when you’re ready.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
                tier.highlighted
                  ? "border-accent bg-card shadow-md ring-2 ring-accent/20"
                  : "border-border bg-card"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              {/* Fixed height so Bookings row aligns across all cards */}
              <div className="h-[5.5rem] flex flex-col justify-center mb-4 shrink-0">
                <h2 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-foreground-muted">{tier.period}</span>
                  {tier.priceNote && (
                    <span className="text-sm text-foreground-muted">
                      {tier.priceNote}
                    </span>
                  )}
                </div>
              </div>
              <dl className="mb-4 shrink-0 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-foreground-muted">Bookings</dt>
                  <dd className="font-medium text-foreground">
                    {tier.bookings}
                    {tier.bookingsPeriod}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-foreground-muted">Accounts</dt>
                  <dd className="font-medium text-foreground">{tier.accounts}</dd>
                </div>
              </dl>
              {/* Fixed height so description never pushes CTA down differently (fits 3 lines) */}
              <p className="mb-5 h-[4.75rem] text-sm leading-relaxed text-foreground-muted shrink-0">
                {tier.description}
              </p>
              {/* flex-1 so this fills remaining space; CTA stays at bottom with mt-auto */}
              <ul className="mb-6 min-h-[8rem] flex-1 space-y-2 text-sm text-foreground-muted shrink-0">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.ctaHref.startsWith("/") ? (
                <Link
                  href={tier.ctaHref}
                  className={`mt-auto block w-full shrink-0 rounded-full py-3 text-center text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-border bg-card text-foreground hover:bg-background-secondary"
                  }`}
                >
                  {tier.cta}
                </Link>
              ) : (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto block w-full shrink-0 rounded-full py-3 text-center text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-border bg-card text-foreground hover:bg-background-secondary"
                  }`}
                >
                  {tier.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-foreground-muted">
          All plans include Gmail sync, AI extraction, and support for Airbnb,
          GetYourGuide, Viator, Civitatis, TripAdvisor, and more. Questions?{" "}
          <a
            href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Book a call
          </a>
          .
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background-secondary py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Ready to save hours every week?
          </h2>
          <p className="mb-6 text-foreground-muted">
            Join the agencies already using BookSmart to streamline their
            bookings.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-border bg-card px-8 py-3 font-medium text-foreground transition-colors hover:bg-background"
            >
              Back to Home
            </Link>
            <a
              href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
