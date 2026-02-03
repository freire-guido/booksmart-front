import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[#EA580C]">
            Our Story
          </p>
          <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-[#1C1917] lg:text-5xl">
            Built from the kitchen table
          </h1>
        </div>

        {/* Founder Section */}
        <div className="mb-20 grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Founder Image */}
          <div className="mx-auto max-w-[280px] lg:col-span-2 lg:mx-0 lg:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#E7E5E4]">
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
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="mb-1 text-2xl font-semibold text-[#1C1917]">
                  Guido Freire
                </h2>
                <p className="text-[#EA580C]">Founder & CEO</p>
                <p className="text-sm text-[#78716C]">
                  AI Researcher · Data Science MSc
                </p>
              </div>

              <div className="space-y-4 text-[#57534E]">
                <p className="leading-relaxed">
                  My family has been in hospitality forever. I got tired of watching them comb through emails for hours every morning. Airbnb, GetYourGuide, Viator, direct bookings.
                </p>
                <p className="leading-relaxed">
                  The thing that frustrated me most? Ask any of these businesses a simple question: <span className="font-medium text-[#1C1917]">&ldquo;How many guests did you serve last month?&rdquo;</span> and they couldn&apos;t tell you. Everything was scattered across inboxes and spreadsheets and sticky notes.
                </p>
                <p className="leading-relaxed">
                  I figured if I could build clinical data infrastructure for pharma companies, I could probably parse a dinner reservation.
                </p>
                <p className="leading-relaxed font-medium text-[#1C1917]">
                  Turns out I could. And now I&apos;m helping others do the same, and save 3+ hours every day like we did.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="mb-12 text-center text-2xl font-semibold text-[#1C1917]">
            The Journey
          </h2>
          <div className="relative pl-4 lg:pl-0">
            {/* Timeline line - left on mobile, center on desktop */}
            <div className="absolute left-0 top-0 h-full w-px bg-[#E7E5E4] lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-12 lg:space-y-0">
              {[
                {
                  year: "Growing Up",
                  title: "Family roots",
                  description:
                    "Raised in a family of cooks and dinner parties. Learned firsthand that great hospitality is about people, not paperwork.",
                  side: "left",
                },
                {
                  year: "2023",
                  title: "MSc in Data Science",
                  description:
                    "Completed my Master's in Data Science, diving deep into AI, and extracting meaning from messy, unstructured data.",
                  side: "right",
                },
                {
                  year: "2024",
                  title: "Pharma consulting",
                  description:
                    "Built clinical trial data infrastructure for large pharmaceutical companies. Learned how to design systems that handle complex, high-stakes information at scale.",
                  side: "left",
                },
                {
                  year: "2024",
                  title: "The breaking point",
                  description:
                    "Watching my parents spend hours daily managing bookings across 12+ platforms. There had to be a better way.",
                  side: "right",
                },
                {
                  year: "2025",
                  title: "First prototype",
                  description:
                    "Built the first version of BookSmart. Saved my parents 3+ hours every day.",
                  side: "left",
                },
                {
                  year: "2026",
                  title: "Growing fast",
                  description:
                    "Early access launch. Now trusted by 5 agencies and serving 2,000+ travellers every month.",
                  side: "right",
                },
                {
                  year: "Today",
                  title: "Just the beginning",
                  description:
                    "Building the future of hospitality operations.",
                  side: "left",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative lg:flex lg:items-center ${
                    item.side === "right" ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`pl-8 lg:pl-0 lg:w-1/2 ${
                      item.side === "right" ? "lg:pl-16" : "lg:pr-16 lg:text-right"
                    }`}
                  >
                    <div
                      className={`rounded-2xl border border-[#E7E5E4] bg-white p-6 ${
                        item.side === "right" ? "" : "lg:ml-auto"
                      } lg:max-w-md`}
                    >
                      <p className="mb-1 text-sm font-semibold text-[#EA580C]">
                        {item.year}
                      </p>
                      <h3 className="mb-2 text-lg font-semibold text-[#1C1917]">
                        {item.title}
                      </h3>
                      <p className="text-[#78716C]">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot - left on mobile, center on desktop */}
                  <div className="absolute left-0 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-[#FAF8F5] bg-[#EA580C] lg:left-1/2" />

                  {/* Empty space for the other side */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] p-8 text-center lg:p-12">
          <h2 className="mb-4 text-2xl font-semibold text-white lg:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            To give hospitality professionals their time back so they can focus on creating unforgettable experiences, not managing spreadsheets.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E7E5E4] bg-[#FDF6EC] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-[#1C1917]">
            Ready to save hours every week?
          </h2>
          <p className="mb-8 text-[#78716C]">
            Join the agencies already using BookSmart to streamline their bookings.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-[#E7E5E4] bg-white px-8 py-3 font-medium text-[#1C1917] transition-colors hover:bg-[#FAF8F5]"
            >
              Back to Home
            </Link>
            <a
              href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#EA580C] px-8 py-3 font-medium text-white transition-colors hover:bg-[#C2410C]"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E4] bg-[#FAF8F5] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA580C]">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[#1C1917]">
                BookSmart
              </span>
            </Link>
            <a
              href="mailto:freireguidoi@gmail.com?subject=BookSmart%20Inquiry&body=Hi%20BookSmart%20team%2C"
              className="text-sm text-[#78716C] hover:text-[#1C1917]"
            >
              Contact Us
            </a>
            <p className="text-sm text-[#78716C]">Built in Buenos Aires</p>
            <p className="text-sm text-[#78716C]">
              © 2026 BookSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
