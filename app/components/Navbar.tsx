"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const pillFrost = "border border-white/20 bg-white/60 shadow-lg shadow-black/5 backdrop-blur-md";

  return (
    <>
      <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
        {/* Top bar: only this has the pill bg when closed; when open it gets rounded-t so dropdown can sit below with page behind it */}
        <div
          className={`mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 ${pillFrost} ${open ? "rounded-t-2xl border-b-0" : "rounded-2xl"}`}
        >
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent sm:h-8 sm:w-8">
              <svg
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
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
            <span className="text-base font-semibold text-foreground sm:text-xl">
              BookSmart
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:px-5"
            >
              Request Demo
            </a>
            <button
              type="button"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white/80"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className={`rounded-b-2xl border border-white/20 border-t-0 bg-white/60 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-md`}>
            <div className="flex flex-col items-center justify-center gap-1">
              <Link
                href="/about"
                className="w-full rounded-lg px-3 py-2.5 text-center text-sm font-medium text-foreground-muted hover:bg-white/20 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="w-full rounded-lg px-3 py-2.5 text-center text-sm font-medium text-foreground-muted hover:bg-white/20 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="w-full rounded-lg px-3 py-2.5 text-center text-sm font-medium text-foreground-muted hover:bg-white/20 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="h-[4.5rem]" aria-hidden="true" />
    </>
  );
}
