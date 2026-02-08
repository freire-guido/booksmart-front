import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="text-8xl font-bold tracking-tighter text-[#E7E5E4] sm:text-9xl">
              404
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-semibold text-[#1C1917] sm:text-3xl">
            No booking at this address
          </h1>
          <p className="mb-10 text-lg text-[#78716C]">
            This link isn&apos;t on the schedule. It may have been cancelled or the URL might be wrong.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-[#EA580C] px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C2410C]"
            >
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-[#E7E5E4] bg-white px-8 py-3.5 text-base font-medium text-[#1C1917] transition-colors hover:bg-[#FDF6EC]"
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
