import Footer from "./components/Footer";
import HeroAnimation from "./components/HeroAnimation";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FDF6EC] px-4 py-2 text-sm text-[#78716C]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EA580C] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EA580C]"></span>
              </span>
              Trusted by 2,000+ travellers every month
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#1C1917] lg:text-5xl lg:leading-tight">
              Focus on your guests, not your inbox
            </h1>
            <p className="text-lg leading-relaxed text-[#78716C] lg:text-xl">
              BookSmart reads your Gmail confirmations from Airbnb, GetYourGuide,
              Viator and more, keeping your schedule live and accurate,
              automatically.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#EA580C] px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C2410C] text-center"
              >
                Get Early Access
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-[#E7E5E4] bg-white px-8 py-3.5 text-base font-medium text-[#1C1917] transition-colors hover:bg-[#FDF6EC] text-center"
              >
                See How It Works
              </a>
            </div>
          </div>

{/* Hero Visual - Animated Emails to Calendar */}
          <HeroAnimation />
        </div>
      </section>

      {/* Platform Integrations Bar */}
      <section className="border-y border-[#E7E5E4] bg-white py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-sm text-[#78716C]">
            Works with your favorite booking platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {[
              "TripAdvisor",
              "Meitre",
              "GetYourGuide",
              "Airbnb",
              "Viator",
              "Civitatis",
            ].map((platform) => (
              <span
                key={platform}
                className="text-lg font-medium text-[#78716C] transition-colors hover:text-[#1C1917]"
              >
                {platform}
              </span>
            ))}
            <span className="text-lg font-medium text-[#EA580C]">
              +more
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-[#1C1917] lg:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#78716C]">
            Three simple steps to transform your booking management
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Connect",
              description: "Link your Gmail account with one click. We only read booking confirmations.",
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              ),
            },
            {
              step: "02",
              title: "Parse",
              description: "Our AI extracts guest names, dates, dietary needs, and special requests automatically.",
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Schedule",
              description: "View all your reservations in one clean dashboard, always up to date.",
              icon: (
                <svg
                  className="h-6 w-6"
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
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group rounded-2xl border border-[#E7E5E4] bg-white p-8 transition-all hover:border-[#EA580C]/20 hover:shadow-lg hover:shadow-[#EA580C]/5"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EA580C]/10 text-[#EA580C] transition-colors group-hover:bg-[#EA580C] group-hover:text-white">
                  {item.icon}
                </div>
                <span className="text-4xl font-bold text-[#E7E5E4]">
                  {item.step}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#1C1917]">
                {item.title}
              </h3>
              <p className="text-[#78716C]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Sync Features - Now with warm tan/orange gradient instead of black */}
      <section className="bg-gradient-to-br from-[#EA580C] to-[#C2410C] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              LIVE
            </div>
            <h2 className="mb-4 text-3xl font-semibold text-white lg:text-4xl">
              Always up to date. Always accurate.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Your schedule stays perfectly synced with every change
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Live Cancellation Detection",
                description:
                  "Booking cancelled? Your schedule updates instantly. No more ghost reservations.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ),
              },
              {
                title: "Reschedule Tracking",
                description:
                  "Date changes sync automatically, no manual updates needed.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ),
              },
              {
                title: "Dietary Restrictions",
                description:
                  "Food allergies and preferences captured from every booking confirmation.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
              },
              {
                title: "Special Requests",
                description:
                  "Guest notes and requirements all in one place, nothing slips through.",
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-[#1C1917] lg:text-4xl">
            Everything in one place
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#78716C]">
            A clean dashboard that shows you exactly what you need
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-2xl shadow-[#EA580C]/5 lg:p-8">
          {/* Dashboard Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-[#1C1917]">
                Upcoming Reservations
              </h3>
              <p className="text-sm text-[#78716C]">February 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Live · Synced 2 min ago
              </span>
            </div>
          </div>

          {/* Booking Cards - Now showing same date with multiple platforms */}
          <div className="space-y-4">
            {/* Feb 15 - Multiple bookings on same day */}
            <div className="rounded-xl border border-[#EA580C]/20 bg-[#EA580C]/5 p-4 overflow-hidden">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-center shrink-0">
                    <p className="text-xs uppercase text-[#78716C]">Feb</p>
                    <p className="text-2xl font-semibold text-[#EA580C]">15</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#1C1917]">Saturday</p>
                    <p className="text-sm text-[#78716C]">3 bookings · 8 guests total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pl-0 sm:pl-12 overflow-hidden">
                <div className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-center overflow-hidden">
                  <div className="flex items-center gap-2 sm:w-32 shrink-0">
                    <span className="rounded bg-[#FF5A5F]/10 px-2 py-0.5 text-xs font-medium text-[#FF5A5F]">Airbnb</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1917] truncate">Natalia Oreiro</p>
                    <p className="text-xs text-[#78716C]">2 guests · 3 nights</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-[#EA580C]">Vegetarian</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">Early check-in</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-center overflow-hidden">
                  <div className="flex items-center gap-2 sm:w-32 shrink-0">
                    <span className="rounded bg-[#FF5533]/10 px-2 py-0.5 text-xs font-medium text-[#FF5533]">GetYourGuide</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1917] truncate">Ricardo Darín</p>
                    <p className="text-xs text-[#78716C]">4 guests · Day tour</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-[#EA580C]">Gluten-free</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 rounded-lg bg-white p-3 sm:flex-row sm:items-center overflow-hidden">
                  <div className="flex items-center gap-2 sm:w-32 shrink-0">
                    <span className="rounded bg-[#00AA6C]/10 px-2 py-0.5 text-xs font-medium text-[#00AA6C]">Viator</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1917] truncate">Luisana Lopilato</p>
                    <p className="text-xs text-[#78716C]">2 guests · Food tour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feb 16 */}
            <div className="flex flex-col gap-4 rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] p-4 sm:flex-row sm:items-center overflow-hidden">
              <div className="flex items-center gap-4 sm:w-24 shrink-0">
                <div className="text-center">
                  <p className="text-xs uppercase text-[#78716C]">Feb</p>
                  <p className="text-2xl font-semibold text-[#EA580C]">16</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1C1917] truncate">Guillermo Francella</p>
                <p className="text-sm text-[#78716C] truncate">6 guests · Civitatis · Wine tasting</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-[#EA580C]">Vegan (2)</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Rescheduled</span>
              </div>
            </div>

            {/* Feb 17 */}
            <div className="flex flex-col gap-4 rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] p-4 sm:flex-row sm:items-center overflow-hidden">
              <div className="flex items-center gap-4 sm:w-24 shrink-0">
                <div className="text-center">
                  <p className="text-xs uppercase text-[#78716C]">Feb</p>
                  <p className="text-2xl font-semibold text-[#EA580C]">17</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1C1917] truncate">Mercedes Morán</p>
                <p className="text-sm text-[#78716C] truncate">3 guests · TripAdvisor · City tour</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Private guide requested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Partners */}
      <section className="border-y border-[#E7E5E4] bg-[#FDF6EC] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-[#1C1917] lg:text-4xl">
              Already saving hours for leading agencies
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#78716C]">
              Trusted by tourism professionals in Buenos Aires
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { name: "The Mate Experience", href: "https://www.getyourguide.com/buenos-aires-l1/buenos-aires-argentine-mate-break-in-45-minutes-t1057199/?ranking_uuid=63d35cda-5228-4e32-b3fd-eb37a1c6be22" },
              { name: "Betty and Marcelo", href: "https://www.bettyandmarcelo.com" },
              { name: "ARTour" },
              { name: "SeeBA" },
              { name: "Football Fans BA", href: "https://www.getyourguide.com/buenos-aires-l1/buenos-aires-soccer-match-experience-with-tickets-t1092814/?ranking_uuid=af590b33-3eac-4723-a0e8-b3c1cce390b2" },
              { name: "+you", comingSoon: true },
            ].map((partner) => {
              const isComingSoon = partner.comingSoon === true;
              const displayName = partner.name;
              const href = "href" in partner ? partner.href : undefined;
              const baseClasses = `flex flex-col items-center justify-center rounded-xl border px-6 py-8 text-center transition-all ${
                isComingSoon
                  ? "border-dashed border-[#EA580C]/40 bg-[#EA580C]/5 hover:border-[#EA580C]/60"
                  : "border-[#E7E5E4] bg-white hover:border-[#EA580C]/20 hover:shadow-lg hover:shadow-[#EA580C]/5"
              }`;
              const content = (
                <>
                  <span className={`text-lg font-medium ${isComingSoon ? "text-[#EA580C]" : "text-[#1C1917]"}`}>
                    {displayName}
                  </span>
                  {isComingSoon && (
                    <span className="mt-1 text-xs font-medium text-[#78716C]">coming soon</span>
                  )}
                </>
              );
              if (href) {
                return (
                  <a
                    key={displayName}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClasses}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <div key={displayName} className={baseClasses}>
                  {content}
                </div>
              );
            })}
          </div>

          {/* Testimonials - Two cards */}
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* First Testimonial */}
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8">
              <svg
                className="mb-4 h-8 w-8 text-[#EA580C]/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mb-6 text-lg text-[#1C1917]">
                &ldquo;Before BookSmart, I spent 2 hours every morning checking emails
                and updating spreadsheets. Now it just happens automatically.&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-[#1C1917]">Vero</p>
                <p className="text-sm text-[#78716C]">The Mate Experience</p>
              </div>
            </div>

            {/* Second Testimonial - Betty */}
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8">
              <svg
                className="mb-4 h-8 w-8 text-[#EA580C]/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mb-6 text-lg text-[#1C1917]">
                &ldquo;We used to mix up dietary requests and double-book tours all the time. Now everything&apos;s in one place, we make way fewer mistakes, and I can actually focus on giving our guests a great time. Our reviews went up and so did our bookings.&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-[#1C1917]">Betty</p>
                <p className="text-sm text-[#78716C]">Betty and Marcelo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Changed from black to warm gradient */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="rounded-3xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] px-6 py-16 text-center lg:px-16 lg:py-24">
          <h2 className="mb-4 text-3xl font-semibold text-white lg:text-4xl">
            Ready to focus on what matters?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
            Let BookSmart handle the admin so you can focus on your guests&apos;
            experience.
          </p>
          <a
            href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-white px-8 py-3.5 font-medium text-[#EA580C] transition-colors hover:bg-[#FDF6EC]"
          >
            Request Access
          </a>
          <p className="mt-6 text-sm text-white/60">
            Join leading agencies already using BookSmart
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
