import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="text-8xl font-bold tracking-tighter text-border sm:text-9xl">
              404
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-semibold text-foreground sm:text-3xl">
            No booking at this address
          </h1>
          <p className="mb-10 text-lg text-foreground-muted">
            This link isn&apos;t on the schedule. It may have been cancelled or the URL might be wrong.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-accent px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-border bg-card px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-background-secondary"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
