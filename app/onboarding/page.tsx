"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step =
  | "gmail-connected"
  | "choose-method"
  | "email-sources"
  | "csv-upload"
  | "scanning"
  | "csv-mapping"
  | "complete";

type User = {
  email: string;
  name: string | null;
  picture: string | null;
};

type ColumnMapping = {
  csv_column: string;
  booking_field: string | null;
};

// Key fields first, then less important; key: true = bold
const BOOKING_FIELDS: { value: string; label: string; key?: boolean }[] = [
  { value: "guest_name", label: "Guest Name", key: true },
  { value: "guest_count", label: "Guest Count", key: true },
  { value: "booking_date", label: "Booking Date", key: true },
  { value: "platform", label: "Platform", key: true },
  { value: "activity_name", label: "Activity Name", key: true },
  { value: "dietary_restrictions", label: "Dietary Restrictions", key: true },
  { value: "booking_time", label: "Booking Time" },
  { value: "special_requests", label: "Special Requests" },
  { value: "status", label: "Status" },
];

const DEFAULT_EMAIL_SOURCES = [
  { email: "express@airbnb.com", platform: "Airbnb" },
  { email: "noreply@viator.com", platform: "Viator" },
  { email: "noreply@getyourguide.com", platform: "GetYourGuide" },
  { email: "noreply@civitatis.com", platform: "Civitatis" },
  { email: "noreply@tripadvisor.com", platform: "TripAdvisor" },
  { email: "noreply@booking.com", platform: "Booking.com" },
  { email: "expediamail@expedia.com", platform: "Expedia" },
  { email: "noreply@meitre.com", platform: "Meitre" },
];

// Step indicator labels for progress
const STEP_LABELS: Record<Step, string> = {
  "gmail-connected": "Connected",
  "choose-method": "Import Method",
  "email-sources": "Email Sources",
  "csv-upload": "Upload CSV",
  scanning: "Scanning",
  "csv-mapping": "Map Columns",
  complete: "Complete",
};

function getStepSequence(method: "gmail" | "csv" | null): Step[] {
  if (method === "gmail") {
    return ["gmail-connected", "choose-method", "email-sources", "scanning", "complete"];
  }
  if (method === "csv") {
    return ["gmail-connected", "choose-method", "csv-upload", "csv-mapping", "complete"];
  }
  return ["gmail-connected", "choose-method"];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("gmail-connected");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<"gmail" | "csv" | null>(null);

  // Email sources state
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(
    new Set(DEFAULT_EMAIL_SOURCES.map((s) => s.email))
  );
  const [customEmail, setCustomEmail] = useState("");
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // Scanning state
  const [bookingCount, setBookingCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLines, setCsvLines] = useState<string[]>([]);
  const [csvAllLines, setCsvAllLines] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Complete state
  const [importedCount, setImportedCount] = useState(0);

  // Fetch user on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          router.push("/login");
          return;
        }
        if (data.user.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const toggleEmail = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const addCustomEmail = () => {
    const trimmed = customEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;
    if (selectedEmails.has(trimmed) || customEmails.includes(trimmed)) return;
    setCustomEmails((prev) => [...prev, trimmed]);
    setSelectedEmails((prev) => new Set([...prev, trimmed]));
    setCustomEmail("");
  };

  const removeCustomEmail = (email: string) => {
    setCustomEmails((prev) => prev.filter((e) => e !== email));
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      next.delete(email);
      return next;
    });
  };

  const startScanning = async () => {
    setScanLoading(true);
    setScanError(null);
    try {
      const res = await fetch("/api/onboarding/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_addresses: Array.from(selectedEmails),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start scanning");
      }
      setStep("scanning");
      // Start polling for booking count
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch("/api/onboarding/status");
          const statusData = await statusRes.json();
          setBookingCount(statusData.count || 0);
        } catch {
          // ignore polling errors
        }
      }, 3000);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Failed to start scanning");
    } finally {
      setScanLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setCsvFile(file);
    setCsvError(null);
    setMappingLoading(true);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      setCsvAllLines(lines);

      // Take first 10 lines for preview & mapping
      const preview = lines.slice(0, 10);
      setCsvLines(preview);

      // Send to API for mapping
      const res = await fetch("/api/onboarding/csv-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: preview.join("\n") }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate mapping");
      }

      const data = await res.json();
      const headers = preview[0]
        .split(",")
        .map((h: string) => h.trim().replace(/^"|"$/g, ""));
      const normalized: ColumnMapping[] = headers.map((header: string) => {
        const match = data.mapping?.find(
          (m: ColumnMapping) =>
            m.csv_column?.trim().toLowerCase() === header.trim().toLowerCase()
        );
        return { csv_column: header, booking_field: match?.booking_field ?? null };
      });
      setMapping(normalized);
      setStep("csv-mapping");
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : "Failed to process CSV");
    } finally {
      setMappingLoading(false);
    }
  };

  const updateMappingByField = (bookingField: string, csvColumn: string | null) => {
    setMapping((prev) =>
      prev.map((m) => {
        if (m.booking_field === bookingField) return { ...m, booking_field: null };
        if (
          csvColumn &&
          m.csv_column.trim().toLowerCase() === csvColumn.trim().toLowerCase()
        )
          return { ...m, booking_field: bookingField };
        return m;
      })
    );
  };

  const applyMappingAndImport = async () => {
    setImportLoading(true);
    setCsvError(null);

    try {
      // Parse CSV header
      const header = csvAllLines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

      // Build column index map from mapping
      const fieldMap: Record<string, number> = {};
      for (const m of mapping) {
        if (m.booking_field) {
          const colIndex = header.findIndex(
            (h) => h.toLowerCase() === m.csv_column.toLowerCase()
          );
          if (colIndex !== -1) fieldMap[m.booking_field] = colIndex;
        }
      }

      // Parse all data rows
      const bookings: Record<string, string | number | null>[] = [];
      for (let i = 1; i < csvAllLines.length; i++) {
        const row = parseCSVRow(csvAllLines[i]);
        if (row.length === 0) continue;

        const booking: Record<string, string | number | null> = {};
        for (const [field, colIdx] of Object.entries(fieldMap)) {
          const val = row[colIdx]?.trim() || null;
          if (field === "guest_count" && val) {
            booking[field] = parseInt(val, 10) || 1;
          } else {
            booking[field] = val;
          }
        }

        // Skip rows without at least a guest_name or booking_date
        if (booking.guest_name || booking.booking_date) {
          bookings.push(booking);
        }
      }

      if (bookings.length === 0) {
        throw new Error("No valid bookings found in CSV");
      }

      // Send to import API
      const res = await fetch("/api/onboarding/csv-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookings }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import bookings");
      }

      const data = await res.json();
      setImportedCount(data.count || bookings.length);
      setStep("complete");
    } catch (err) {
      setCsvError(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setImportLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
    } catch {
      // best effort
    }
    router.push("/dashboard");
  };

  const pollAndContinue = useCallback(async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    // Get final count
    try {
      const res = await fetch("/api/onboarding/status");
      const data = await res.json();
      setImportedCount(data.count || bookingCount);
    } catch {
      setImportedCount(bookingCount);
    }
    setStep("complete");
  }, [bookingCount]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E7E5E4] border-t-[#EA580C]" />
      </div>
    );
  }

  if (!user) return null;

  const stepSequence = getStepSequence(method);
  const currentStepIndex = stepSequence.indexOf(step);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Header */}
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
            <span className="text-xl font-semibold text-[#1C1917]">BookSmart</span>
          </Link>
        </div>
      </header>

      {/* Step indicator */}
      <div className="mx-auto w-full max-w-2xl px-6 pt-8">
        <div className="flex items-center justify-center gap-2">
          {stepSequence.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  i < currentStepIndex
                    ? "bg-[#EA580C] text-white"
                    : i === currentStepIndex
                      ? "bg-[#EA580C] text-white"
                      : "bg-[#E7E5E4] text-[#78716C]"
                }`}
              >
                {i < currentStepIndex ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`hidden text-xs sm:inline ${
                  i <= currentStepIndex ? "font-medium text-[#1C1917]" : "text-[#78716C]"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
              {i < stepSequence.length - 1 && (
                <div
                  className={`h-px w-6 sm:w-10 ${
                    i < currentStepIndex ? "bg-[#EA580C]" : "bg-[#E7E5E4]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex flex-1 items-start justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          {/* Step 1: Gmail Connected */}
          {step === "gmail-connected" && (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-[#1C1917]">Gmail Connected</h1>
                <p className="mt-2 text-[#78716C]">Your account is ready to go</p>
              </div>

              <div className="mb-8 flex items-center gap-4 rounded-xl bg-[#FDF6EC] p-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-12 w-12 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EA580C] text-lg font-semibold text-white">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  {user.name && (
                    <p className="truncate font-medium text-[#1C1917]">{user.name}</p>
                  )}
                  <p className="truncate text-sm text-[#78716C]">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => setStep("choose-method")}
                className="w-full rounded-full bg-[#EA580C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#C2410C]"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Choose Method */}
          {step === "choose-method" && (
            <div className="space-y-4">
              <div className="mb-2 text-center">
                <h1 className="text-2xl font-semibold text-[#1C1917]">Import Your Bookings</h1>
                <p className="mt-2 text-[#78716C]">
                  How would you like to bring in your existing bookings?
                </p>
              </div>

              <button
                onClick={() => {
                  setMethod("gmail");
                  setStep("email-sources");
                }}
                className="w-full rounded-2xl border border-[#E7E5E4] bg-white p-6 text-left shadow-lg shadow-[#EA580C]/5 transition-all hover:border-[#EA580C] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EA580C]/10">
                    <svg className="h-6 w-6 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#1C1917]">Scan Gmail</h2>
                    <p className="mt-1 text-sm text-[#78716C]">
                      We&apos;ll scan your last year of booking emails
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMethod("csv");
                  setStep("csv-upload");
                }}
                className="w-full rounded-2xl border border-[#E7E5E4] bg-white p-6 text-left shadow-lg shadow-[#EA580C]/5 transition-all hover:border-[#EA580C] hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EA580C]/10">
                    <svg className="h-6 w-6 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#1C1917]">Upload CSV</h2>
                    <p className="mt-1 text-sm text-[#78716C]">
                      Import bookings from a spreadsheet
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step 3a: Email Sources */}
          {step === "email-sources" && (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#1C1917]">Email Sources</h1>
                <p className="mt-2 text-sm text-[#78716C]">
                  Select which booking platforms to scan for
                </p>
              </div>

              <div className="mb-6 space-y-2">
                {DEFAULT_EMAIL_SOURCES.map((source) => (
                  <label
                    key={source.email}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#FDF6EC]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(source.email)}
                      onChange={() => toggleEmail(source.email)}
                      className="h-4 w-4 rounded border-[#E7E5E4] accent-[#EA580C]"
                    />
                    <span className="flex-1 text-sm text-[#1C1917]">{source.platform}</span>
                    <span className="text-xs text-[#78716C]">{source.email}</span>
                  </label>
                ))}

                {/* Custom emails */}
                {customEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#FDF6EC]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(email)}
                      onChange={() => toggleEmail(email)}
                      className="h-4 w-4 rounded border-[#E7E5E4] accent-[#EA580C]"
                    />
                    <span className="flex-1 text-sm text-[#1C1917]">{email}</span>
                    <button
                      onClick={() => removeCustomEmail(email)}
                      className="text-[#78716C] hover:text-red-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add custom email */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomEmail()}
                    placeholder="Add custom email address"
                    className="flex-1 rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                  />
                  <button
                    onClick={addCustomEmail}
                    className="rounded-lg border border-[#E7E5E4] px-3 py-2 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#FDF6EC] hover:text-[#1C1917]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {scanError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {scanError}
                </div>
              )}

              <button
                onClick={startScanning}
                disabled={selectedEmails.size === 0 || scanLoading}
                className="w-full rounded-full bg-[#EA580C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#C2410C] disabled:opacity-50"
              >
                {scanLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Starting scan…
                  </span>
                ) : (
                  "Start Scanning"
                )}
              </button>
            </div>
          )}

          {/* Step 4a: Scanning Progress */}
          {step === "scanning" && (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EA580C]/10">
                  <svg className="h-7 w-7 animate-spin text-[#EA580C]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-[#1C1917]">Scanning Your Emails</h1>
                <p className="mt-2 text-[#78716C]">
                  This may take a few minutes. You can continue while we work in the background.
                </p>
              </div>

              <div className="mb-8 rounded-xl bg-[#FDF6EC] p-6 text-center">
                <p className="text-3xl font-bold text-[#EA580C]">{bookingCount}</p>
                <p className="mt-1 text-sm text-[#78716C]">bookings found so far</p>
              </div>

              <button
                onClick={pollAndContinue}
                className="w-full rounded-full bg-[#EA580C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#C2410C]"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {/* Step 3b: CSV Upload */}
          {step === "csv-upload" && (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#1C1917]">Upload CSV</h1>
                <p className="mt-2 text-sm text-[#78716C]">
                  Upload a spreadsheet with your booking data. We&apos;ll automatically map the columns.
                </p>
              </div>

              <div className="mb-6">
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                    csvFile
                      ? "border-[#EA580C] bg-[#EA580C]/5"
                      : "border-[#E7E5E4] hover:border-[#EA580C] hover:bg-[#FDF6EC]"
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  {mappingLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E7E5E4] border-t-[#EA580C]" />
                      <p className="text-sm font-medium text-[#1C1917]">Processing {csvFile?.name}…</p>
                      <p className="text-xs text-[#78716C]">Analyzing columns and generating mapping</p>
                    </div>
                  ) : csvFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-8 w-8 text-[#EA580C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-medium text-[#1C1917]">{csvFile.name}</p>
                      <p className="text-xs text-[#78716C]">Click to choose a different file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-8 w-8 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium text-[#1C1917]">Click to upload CSV</p>
                      <p className="text-xs text-[#78716C]">or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>

              {csvError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {csvError}
                </div>
              )}
            </div>
          )}

          {/* Step 4b: Column Mapping Editor */}
          {step === "csv-mapping" && (
            <div className="max-w-2xl rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#1C1917]">Map Columns</h1>
                <p className="mt-2 text-sm text-[#78716C]">
                  We&apos;ve suggested mappings based on your data. Review and adjust if needed.
                </p>
              </div>

              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E7E5E4]">
                      <th className="pb-2 pr-4 text-left font-medium text-[#78716C]">Booking field</th>
                      <th className="pb-2 pr-4 text-left font-medium text-[#78716C]">Sample</th>
                      <th className="pb-2 text-left font-medium text-[#78716C]">CSV column</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BOOKING_FIELDS.map((f) => {
                      const selectedCsv = mapping.find(
                        (m) => m.booking_field === f.value
                      )?.csv_column ?? "";
                      const headerRow =
                        csvLines[0]?.split(",").map((h) => h.trim().replace(/^"|"$/g, "")) || [];
                      const colIdx = headerRow.findIndex(
                        (h) => h.toLowerCase() === selectedCsv.toLowerCase()
                      );
                      const sampleRow =
                        csvLines[1]?.split(",").map((v) => v.trim().replace(/^"|"$/g, "")) || [];
                      const sample =
                        colIdx >= 0 ? (sampleRow[colIdx] ?? "") : "";
                      const csvColumns = mapping.map((m) => m.csv_column);

                      return (
                        <tr
                          key={f.value}
                          className="border-b border-[#E7E5E4] last:border-0"
                        >
                          <td className="py-3 pr-4">
                            <span
                              className={
                                f.key
                                  ? "font-semibold text-[#1C1917]"
                                  : "text-[#1C1917]"
                              }
                            >
                              {f.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-[#78716C]">
                            <span className="inline-block max-w-[120px] truncate">
                              {sample}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={selectedCsv}
                              onChange={(e) =>
                                updateMappingByField(
                                  f.value,
                                  e.target.value || null
                                )
                              }
                              className="w-full rounded-lg border border-[#E7E5E4] px-2 py-1.5 text-sm text-[#1C1917] focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                            >
                              <option value=""></option>
                              {csvColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {csvError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {csvError}
                </div>
              )}

              <button
                onClick={applyMappingAndImport}
                disabled={importLoading || !mapping.some((m) => m.booking_field)}
                className="w-full rounded-full bg-[#EA580C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#C2410C] disabled:opacity-50"
              >
                {importLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Importing…
                  </span>
                ) : (
                  `Import ${csvAllLines.length - 1} Bookings`
                )}
              </button>
            </div>
          )}

          {/* Final: Complete */}
          {step === "complete" && (
            <div className="rounded-2xl border border-[#E7E5E4] bg-white p-8 shadow-lg shadow-[#EA580C]/5">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-[#1C1917]">You&apos;re All Set!</h1>
                <p className="mt-2 text-[#78716C]">
                  {importedCount > 0
                    ? `${importedCount} booking${importedCount === 1 ? "" : "s"} imported successfully.`
                    : "Your account is ready."}
                </p>
                {method === "gmail" && (
                  <p className="mt-1 text-sm text-[#78716C]">
                    We&apos;ll continue scanning in the background.
                  </p>
                )}
              </div>

              <button
                onClick={completeOnboarding}
                className="w-full rounded-full bg-[#EA580C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#C2410C]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Simple CSV row parser that handles quoted fields with commas */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
