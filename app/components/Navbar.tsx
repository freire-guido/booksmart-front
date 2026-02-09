"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-2xl border border-white/20 bg-white/60 shadow-lg shadow-black/5 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EA580C] sm:h-8 sm:w-8">
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
            <span className="text-base font-semibold text-[#1C1917] sm:text-xl">
              BookSmart
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#EA580C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C] sm:px-5"
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
                <svg className="h-5 w-5 text-[#1C1917]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-[#1C1917]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="rounded-b-2xl border-t border-white/20 bg-white/70 px-4 py-3 backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <Link
                href="/about"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#FDF6EC] hover:text-[#1C1917]"
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
