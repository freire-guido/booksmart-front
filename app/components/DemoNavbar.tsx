"use client";

import Link from "next/link";
import { useState } from "react";

// Demo navbar with hardcoded user "Lionel Scaloni" and no-op logout
export default function DemoNavbar() {
  const [open, setOpen] = useState(false);

  const displayName = "Lionel Scaloni";

  const handleLogout = () => {
    // No-op in demo mode
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
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
          <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            Demo
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card md:hidden"
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <span className="px-3 py-2.5 text-sm font-medium text-foreground">
              {displayName}
            </span>
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground-muted hover:bg-background-secondary hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
