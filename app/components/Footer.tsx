import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row flex-wrap">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
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
            <span className="text-lg font-semibold text-foreground">
              BookSmart
            </span>
          </Link>
          <Link href="/about" className="text-sm text-foreground-muted hover:text-foreground">
            About Us
          </Link>
          <Link href="/pricing" className="text-sm text-foreground-muted hover:text-foreground">
            Pricing
          </Link>
          <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/refund" className="text-sm text-foreground-muted hover:text-foreground">
            Refund Policy
          </Link>
          <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground">
            Terms of Service
          </Link>
          <a
            href="mailto:freireguidoi@gmail.com?subject=BookSmart%20Inquiry&body=Hi%20BookSmart%20team%2C"
            className="text-sm text-foreground-muted hover:text-foreground"
          >
            Contact Us
          </a>
          <p className="text-sm text-foreground-muted">
            Built in Buenos Aires
          </p>
          <a
            href="https://ultradynamic.capital/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-muted/80 hover:text-foreground-muted transition-colors"
          >
            Backed by <span className="font-semibold">ULTRA</span>DYNAMIC
          </a>
          <p className="text-sm text-foreground-muted">
            © 2026 BookSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
