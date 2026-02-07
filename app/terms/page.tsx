import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#EA580C]">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[#1C1917] lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-[#78716C]">Last updated: February 7, 2026</p>
        </div>

        <div className="space-y-10 text-[#57534E]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              1. Agreement
            </h2>
            <p className="leading-relaxed">
              By accessing or using BookSmart (&quot;the Service&quot;), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              2. Description of Service
            </h2>
            <p className="leading-relaxed">
              BookSmart is an AI-powered booking management platform that helps hospitality professionals extract and organize booking information from their email inboxes. The Service processes emails to identify and store structured booking data such as guest names, dates, party sizes, and similar details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              3. Your Responsibilities
            </h2>
            <p className="mb-3 leading-relaxed">
              You are responsible for:
            </p>
            <ul className="mb-3 list-inside list-disc space-y-1 pl-2">
              <li>Maintaining the security of your account and any connected email accounts</li>
              <li>Ensuring you have the right to connect and process emails through the Service</li>
              <li>Verifying the accuracy of any extracted information before relying on it</li>
              <li>Complying with all applicable laws in your use of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              4. Accuracy of Extracted Information: Important Disclaimer
            </h2>
            <p className="mb-3 leading-relaxed">
              The Service uses artificial intelligence to automatically extract information from your emails. <strong className="text-[#1C1917]">Extraction is not guaranteed to be complete or accurate.</strong> You are solely responsible for verifying all extracted data before acting on it.
            </p>
            <p className="mb-3 leading-relaxed">
              We expressly disclaim responsibility for missed or incorrect dietary restrictions, allergies, special requests, reschedulings, cancellations, modifications, or any other omissions or errors in extracted information. BookSmart is a management tool and does not replace your own verification and due diligence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by applicable law, BookSmart and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to inaccuracies in extracted information, missed bookings, missed dietary restrictions, missed cancellations or reschedulings, or any reliance on the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              6. Service Availability
            </h2>
            <p className="leading-relaxed">
              We strive to keep the Service available but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service or any part of it at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              7. Termination
            </h2>
            <p className="leading-relaxed">
              You may stop using the Service and disconnect your account at any time. We may suspend or terminate your access if you violate these Terms or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              8. Changes
            </h2>
            <p className="leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              9. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about these Terms, please contact us through the contact options on our website.
            </p>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E5E4] bg-[#FAF8F5] py-8 mt-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#EA580C]">
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
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                Terms of Service
              </Link>
              <Link
                href="/about"
                className="text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                About
              </Link>
              <Link
                href="/about"
                className="text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-[#78716C]">
              © 2026 BookSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
