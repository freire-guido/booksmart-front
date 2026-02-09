import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "BookSmart was built in Buenos Aires to help tourism professionals focus on their guests instead of their inbox. Meet the team and our story.",
  openGraph: {
    title: "About BookSmart - Built from the kitchen table",
    description:
      "BookSmart was built in Buenos Aires to help tourism professionals focus on their guests instead of their inbox.",
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
            Our Story
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            Built from the kitchen table
          </h1>
        </div>

        {/* Founder Section */}
        <div className="mb-12 grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Founder Image */}
          <div className="mx-auto max-w-[280px] lg:col-span-2 lg:mx-0 lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/guido.png"
                alt="Guido Freire, Founder of BookSmart"
                width={400}
                height={500}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h2 className="mb-1 text-2xl font-semibold text-foreground">
                  Guido Freire
                </h2>
                <p className="text-accent">Founder & CEO</p>
                <p className="text-sm text-foreground-muted">
                  AI Researcher · Data Science MSc
                </p>
              </div>

              <div className="space-y-3 text-[#57534E]">
                <p className="leading-relaxed">
                  I&apos;ve seen hospitality from the inside. The reality of combing through emails for hours every morning. Airbnb, GetYourGuide, Viator, direct bookings. It&apos;s the same story everywhere.
                </p>
                <p className="leading-relaxed">
                  The thing that got me: ask many of these businesses a simple question: <span className="font-medium text-foreground">&ldquo;How many guests did you serve last month?&rdquo;</span>, and they can&apos;t tell you. Everything is scattered across inboxes, spreadsheets, and sticky notes.
                </p>
                <p className="leading-relaxed">
                  I figured if I could build clinical trial data infrastructure for large pharmaceutical companies, I could probably parse a dinner reservation.
                </p>
                <p className="leading-relaxed font-medium text-foreground">
                  Turns out I could. Now I&apos;m helping operators get their time back, 3+ hours every day, so they can focus on guests, not admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">
            The Journey
          </h2>
          <div className="relative pl-4 lg:pl-0">
            {/* Timeline line - left on mobile, center on desktop */}
            <div className="absolute left-0 top-0 h-full w-px bg-border lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-8 lg:space-y-10">
              {[
                {
                  year: "Growing Up",
                  side: "left" as const,
                  cards: [
                    {
                      title: "Hospitality roots",
                      description:
                        "Grew up around cooks and dinner parties. Learned early that great hospitality is about people, not paperwork.",
                    },
                  ],
                },
                {
                  year: "2023",
                  side: "right" as const,
                  cards: [
                    {
                      title: "MSc in Data Science",
                      description:
                        "Completed my Master's in Data Science, diving deep into AI, and extracting meaning from messy, unstructured data.",
                    },
                  ],
                },
                {
                  year: "2024",
                  side: "left" as const,
                  cards: [
                    {
                      title: "Pharma consulting",
                      description:
                        "Built clinical trial data infrastructure for large pharmaceutical companies. Learned how to design systems that handle complex, high-stakes information at scale.",
                    },
                    {
                      title: "The breaking point",
                      description:
                        "Seeing operators spend hours every day managing bookings across 12+ platforms. There had to be a better way.",
                    },
                  ],
                },
                {
                  year: "2025",
                  side: "right" as const,
                  cards: [
                    {
                      title: "First prototype",
                      description:
                        "Built the first version of BookSmart. Early users were saving 3+ hours every day from day one.",
                    },
                  ],
                },
                {
                  year: "2026",
                  side: "left" as const,
                  cards: [
                    {
                      title: "Growing fast",
                      description:
                        "Early access launch. Now trusted by 5 agencies and serving 2,000+ travellers every month.",
                    },
                  ],
                },
                {
                  year: "Today",
                  side: "right" as const,
                  cards: [
                    {
                      title: "Just the beginning",
                      description:
                        "Building the future of hospitality operations.",
                    },
                  ],
                },
              ].map((entry, i) => (
                <div
                  key={i}
                  className={`relative lg:flex lg:items-center ${
                    entry.side === "right" ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`pl-8 lg:pl-0 lg:w-1/2 ${
                      entry.side === "right"
                        ? "lg:pl-16"
                        : "lg:pr-16 lg:text-right"
                    }`}
                  >
                    <div
                      className={`space-y-3 ${
                        entry.side === "right" ? "" : "lg:ml-auto"
                      } lg:max-w-md`}
                    >
                      {entry.cards.map((card, j) => (
                        <div
                          key={j}
                          className="rounded-2xl border border-border bg-card p-6"
                        >
                          {j === 0 && (
                            <p className="mb-1 text-sm font-semibold text-accent">
                              {entry.year}
                            </p>
                          )}
                          <h3 className="mb-2 text-lg font-semibold text-foreground">
                            {card.title}
                          </h3>
                          <p className="text-foreground-muted">{card.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline dot - aligned with line on mobile, center on desktop */}
                  <div className="absolute -left-4 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-accent lg:left-1/2" />

                  {/* Empty space for the other side */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-2xl bg-gradient-to-br from-accent to-accent-hover p-6 text-center lg:p-8">
          <h2 className="mb-3 text-2xl font-semibold text-white lg:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            To give hospitality professionals their time back so they can focus on creating unforgettable experiences, not managing spreadsheets.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-background-secondary py-10">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Ready to save hours every week?
          </h2>
          <p className="mb-6 text-foreground-muted">
            Join the agencies already using BookSmart to streamline their bookings.
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
