import Link from "next/link";
import { getGoogleAuthUrl } from "@/lib/google-oauth";

type SearchParams = Promise<{ error?: string; reauth?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, reauth } = await searchParams;
  const needsReauth = reauth === "true";
  // Force consent screen when reauth is requested (e.g. after account was deleted
  // or first sign-in without refresh_token) so Google issues a new refresh_token.
  const googleAuthUrl = getGoogleAuthUrl(needsReauth);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Simple header */}
      <header className="border-b border-[#E7E5E4] bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA580C]">
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
            <span className="text-xl font-semibold text-[#1C1917]">
              BookSmart
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EA580C]/10">
                <svg
                  className="h-7 w-7 text-[#EA580C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#1C1917]">
                Connect Your Gmail
              </h1>
              <p className="mt-2 text-[#78716C]">
                Let BookSmart read your booking confirmations and keep your schedule
                up to date automatically.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Authentication failed
                    </p>
                    <p className="mt-1 text-sm text-red-600">
                      {decodeURIComponent(error)}
                    </p>
                    {needsReauth && (
                      <p className="mt-2 text-sm font-medium text-red-800">
                        Click &quot;Continue with Google&quot; below to sign in again and grant access.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Permissions info */}
            <div className="mb-6 rounded-xl bg-[#FDF6EC] p-4">
              <p className="mb-3 text-sm font-medium text-[#1C1917]">
                We&apos;ll request access to:
              </p>
              <ul className="space-y-2 text-sm text-[#78716C]">
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#EA580C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong className="text-[#1C1917]">Read emails</strong> – to
                    find booking confirmations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#EA580C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong className="text-[#1C1917]">Create labels</strong> – to
                    organize processed emails
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#EA580C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong className="text-[#1C1917]">Apply labels</strong> – to
                    mark emails as processed
                  </span>
                </li>
              </ul>
            </div>

            {/* Connect button — when reauth, URL includes prompt=consent so Google returns refresh_token */}
            <a
              href={googleAuthUrl}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E7E5E4] bg-white px-6 py-3.5 font-medium text-[#1C1917] transition-all hover:bg-[#FDF6EC] hover:shadow-md"
            >
              {/* Google logo */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </a>

            {/* Privacy note */}
            <p className="mt-4 text-center text-xs text-[#A8A29E]">
              We never send emails on your behalf or share your data.
              <br />
              <Link href="/about" className="underline hover:text-[#78716C]">
                Learn more about our privacy practices
              </Link>
            </p>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#78716C] hover:text-[#1C1917]"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
