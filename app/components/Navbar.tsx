"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  email: string;
  name: string | null;
} | null;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname === "/dashboard";

  useEffect(() => {
    if (isDashboard) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isDashboard]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E7E5E4] bg-[#FAF8F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
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

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {isDashboard ? (
            loading ? (
              <div className="h-5 w-20 animate-pulse rounded bg-[#E7E5E4]" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#1C1917]">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#78716C] transition-colors hover:text-[#1C1917]"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-[#78716C] transition-colors hover:text-[#1C1917]"
              >
                Log in
              </Link>
            )
          ) : (
            <>
              <Link
                href="/about"
                className="text-sm font-medium text-[#78716C] transition-colors hover:text-[#1C1917]"
              >
                About
              </Link>
              <a
                href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#EA580C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C2410C]"
              >
                Request Demo
              </a>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7E5E4] bg-white md:hidden"
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#E7E5E4] bg-[#FAF8F5] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {isDashboard ? (
              user ? (
                <>
                  <span className="px-3 py-2.5 text-sm font-medium text-[#1C1917]">
                    {displayName}
                  </span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#78716C] hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
              )
            ) : (
              <>
                <Link
                  href="/about"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#78716C] hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <a
                  href="https://calendar.app.google/S5EC5XVDQoRn8BX4A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#EA580C] px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-[#C2410C]"
                  onClick={() => setOpen(false)}
                >
                  Request Demo
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
