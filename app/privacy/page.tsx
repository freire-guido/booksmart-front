import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BookSmart Privacy Policy. How we collect, use, and protect your information. We do not store full email content—only extracted booking data.",
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#EA580C]">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-[#1C1917] lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#78716C]">Last updated: February 7, 2026</p>
        </div>

        <div className="space-y-10 text-[#57534E]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              1. Overview
            </h2>
            <p className="leading-relaxed">
              BookSmart (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) provides an AI-powered booking management platform that helps hospitality professionals extract and organize booking information from their email inboxes. This Privacy Policy describes how we collect, use, and protect your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              2. Email Processing
            </h2>
            <p className="mb-3 leading-relaxed">
              When you connect your email account (e.g., Gmail) to BookSmart, we process your emails to extract booking-related information. <strong className="text-[#1C1917]">We do not store the full text or content of your emails.</strong> We read emails solely for the purpose of extraction, and we retain only the structured data that we extract, such as guest names, dates, party sizes, booking references, and similar details.
            </p>
            <p className="leading-relaxed">
              The raw email text is processed in real time and is not persisted on our systems. Only the extracted booking information is stored for use within the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              3. AI Processing (OpenAI)
            </h2>
            <p className="mb-3 leading-relaxed">
              We use OpenAI&apos;s Batch API and Responses API to extract booking information from your emails. When your email content is sent to OpenAI for processing, it is subject to OpenAI&apos;s privacy policy and data processing practices. We do not use your data to train AI models.
            </p>
            <p className="leading-relaxed">
              For more information on how OpenAI handles data, please see{" "}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#EA580C] underline hover:text-[#C2410C]"
              >
                OpenAI&apos;s Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              4. What We Store
            </h2>
            <p className="mb-3 leading-relaxed">
              We store:
            </p>
            <ul className="mb-3 list-inside list-disc space-y-1 pl-2">
              <li>Extracted booking information (e.g., guest names, dates, party sizes, booking references, dietary notes as extracted, activity details)</li>
              <li>Your account information (email address, name, authentication credentials)</li>
              <li>Metadata necessary to operate the Service</li>
            </ul>
            <p className="leading-relaxed">
              We do <strong className="text-[#1C1917]">not</strong> store the full text or body of your emails.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              5. Sale of Information
            </h2>
            <p className="leading-relaxed">
              <strong className="text-[#1C1917]">We do not sell your personal information or any extracted data.</strong> Your information is used solely to provide and improve the BookSmart Service. We do not share your data with third parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              6. Accuracy of Extracted Information: Important Disclaimer
            </h2>
            <p className="mb-3 leading-relaxed">
              BookSmart uses artificial intelligence to automatically extract information from your emails. <strong className="text-[#1C1917]">Extraction is not guaranteed to be complete or accurate.</strong> You are solely responsible for verifying the accuracy of any extracted data before relying on it.
            </p>
            <p className="mb-3 leading-relaxed">
              Without limiting the generality of the above, we expressly disclaim responsibility for:
            </p>
            <ul className="mb-3 list-inside list-disc space-y-1 pl-2">
              <li>Missed or incorrect dietary restrictions, allergies, or special requests</li>
              <li>Missed reschedulings, cancellations, or modifications</li>
              <li>Incorrect dates, times, party sizes, or guest details</li>
              <li>Omissions or errors in extracted booking information</li>
            </ul>
            <p className="leading-relaxed">
              You should always independently confirm critical booking details (including dietary requirements, cancellation status, and schedule changes) before providing services to guests. BookSmart is a management tool and does not replace your own verification and due diligence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              7. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by applicable law, BookSmart and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to inaccuracies in extracted information, missed bookings, missed dietary restrictions, missed cancellations or reschedulings, or any reliance on the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              8. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data. Access to your account and extracted information is restricted to authorized personnel and systems. We use secure connections (HTTPS) and follow best practices for data handling.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              9. Your Rights
            </h2>
            <p className="leading-relaxed">
              Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. You may disconnect your email account at any time, which will stop further processing. Historical extracted data may be retained in accordance with our data retention policies. Contact us through the contact options on our website to exercise your rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              10. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#1C1917]">
              11. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about this Privacy Policy or our data practices, please contact us through the contact options on our website.
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
              <a
                href="mailto:freireguidoi@gmail.com?subject=BookSmart%20Inquiry"
                className="text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                Contact
              </a>
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
