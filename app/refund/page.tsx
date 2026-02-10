import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "BookSmart Refund Policy. How refunds and cancellations work for paid plans.",
  robots: { index: true, follow: true },
};

export default function Refund() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-foreground lg:text-5xl">
            Refund Policy
          </h1>
          <p className="text-sm text-foreground-muted">Last updated: February 10, 2026</p>
        </div>

        <div className="space-y-10 text-[#57534E]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              1. Overview
            </h2>
            <p className="leading-relaxed">
              BookSmart offers subscription plans for its booking management service. This Refund Policy explains how refunds and cancellations work when you pay for a paid plan.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              2. Free Plan
            </h2>
            <p className="leading-relaxed">
              The free plan does not require payment. There are no charges to cancel or refund.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              3. Paid Subscriptions: Cancellation
            </h2>
            <p className="mb-3 leading-relaxed">
              You may cancel your paid subscription at any time. Cancellation stops future charges. You will retain access to paid features until the end of the current billing period; no partial refunds are given for unused time within that period.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              4. Refund Requests
            </h2>
            <p className="mb-3 leading-relaxed">
              If you believe you are entitled to a refund (for example, due to a billing error or a significant service issue), please contact us using the contact options on our website. We will review requests on a case-by-case basis and, where appropriate, process refunds in accordance with applicable law and our payment processor&apos;s terms.
            </p>
            <p className="leading-relaxed">
              Refunds, when granted, will be issued to the original payment method within a reasonable timeframe determined by our payment provider.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              5. Contact
            </h2>
            <p className="leading-relaxed">
              For refund requests or questions about this policy, please contact us through the contact options on our website.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
}
