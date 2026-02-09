"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  name: string | null;
} | null;

type DashboardNavbarProps = {
  /** e.g. Live Sync status pill; optional for loading state */
  rightContent?: React.ReactNode;
};

export default function DashboardNavbar({ rightContent }: DashboardNavbarProps) {
  const [user, setUser] = useState<User>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
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
              Dashboard
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-4">
            {rightContent ?? null}
            <span className="truncate text-sm font-medium text-foreground">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="shrink-0 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
      <div className="h-14" aria-hidden="true" />
    </>
  );
}
