import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "BookSmart Terms of Service. Agreement, service description, your responsibilities, and important disclaimers about AI-extracted data.",
  robots: { index: true, follow: true },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-foreground-muted">Last updated: February 7, 2026</p>
        </div>

        <div className="space-y-10 text-[#57534E]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              1. Agreement
            </h2>
            <p className="leading-relaxed">
              By accessing or using BookSmart (&quot;the Service&quot;), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p className="leading-relaxed">
              BookSmart is an AI-powered booking management platform that helps hospitality professionals extract and organize booking information from their email inboxes. The Service processes emails to identify and store structured booking data such as guest names, dates, party sizes, and similar details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
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
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              4. Accuracy of Extracted Information: Important Disclaimer
            </h2>
            <p className="mb-3 leading-relaxed">
              The Service uses artificial intelligence to automatically extract information from your emails. <strong className="text-foreground">Extraction is not guaranteed to be complete or accurate.</strong> You are solely responsible for verifying all extracted data before acting on it.
            </p>
            <p className="mb-3 leading-relaxed">
              We expressly disclaim responsibility for missed or incorrect dietary restrictions, allergies, special requests, reschedulings, cancellations, modifications, or any other omissions or errors in extracted information. BookSmart is a management tool and does not replace your own verification and due diligence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by applicable law, BookSmart and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to inaccuracies in extracted information, missed bookings, missed dietary restrictions, missed cancellations or reschedulings, or any reliance on the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              6. Service Availability
            </h2>
            <p className="leading-relaxed">
              We strive to keep the Service available but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service or any part of it at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              7. Termination
            </h2>
            <p className="leading-relaxed">
              You may stop using the Service and disconnect your account at any time. We may suspend or terminate your access if you violate these Terms or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              8. Changes
            </h2>
            <p className="leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              9. Contact
            </h2>
            <p className="leading-relaxed">
              For questions about these Terms, please contact us through the contact options on our website.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
}
