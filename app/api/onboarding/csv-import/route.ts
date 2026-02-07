import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const ALLOWED_PLATFORMS = new Set([
  "airbnb",
  "viator",
  "getyourguide",
  "civitatis",
  "tripadvisor",
  "booking_com",
  "expedia",
  "meitre",
  "other",
]);

/** Normalize date string to YYYY-MM-DD. Handles DD/MM/YYYY, DD-MM-YYYY, and already ISO. */
function normalizeBookingDate(value: unknown): string | null {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  if (!s) return null;
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // DD/MM/YYYY or DD-MM-YYYY
  const match = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    const day = d!.padStart(2, "0");
    const month = m!.padStart(2, "0");
    return `${y}-${month}-${day}`;
  }
  return null;
}

/** Coerce platform to an allowed enum value; otherwise "other". */
function normalizePlatform(value: unknown): string {
  if (value == null || value === "") return "other";
  const key = String(value).trim().toLowerCase().replace(/\s+/g, "_");
  if (ALLOWED_PLATFORMS.has(key)) return key;
  return "other";
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: user, error: userError } = await supabase
    .from("gmail_accounts")
    .select("id, organization_id")
    .eq("email", session)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { bookings } = body;

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return NextResponse.json(
        { error: "No bookings to import" },
        { status: 400 }
      );
    }

    const todayIso = new Date().toISOString().split("T")[0];

    // Map to database rows
    const rows = bookings.map((b: Record<string, unknown>, i: number) => {
      const rawDate = normalizeBookingDate(b.booking_date);
      return {
        organization_id: user.organization_id,
        created_by_user_id: user.id,
        guest_name: b.guest_name || "Unknown Guest",
        guest_count: typeof b.guest_count === "number" ? b.guest_count : 1,
        booking_date: rawDate || todayIso,
        booking_time: b.booking_time || null,
        platform: normalizePlatform(b.platform),
        activity_name: b.activity_name || null,
        dietary_restrictions: b.dietary_restrictions
          ? [String(b.dietary_restrictions)]
          : null,
        special_requests: b.special_requests
          ? String(b.special_requests)
          : null,
        status: b.status || "confirmed",
        email_id: `csv_import_${Date.now()}_${i}`,
        email_subject: "CSV Import",
        email_preview: "Imported from CSV file",
        email_received_at: new Date().toISOString(),
        extraction_confidence: 1.0,
        manually_reviewed: true,
      };
    });

    // Batch insert (Supabase handles up to 1000 rows per insert)
    const batchSize = 500;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("bookings")
        .insert(batch);

      if (insertError) {
        console.error("Batch insert error:", insertError);
        return NextResponse.json(
          { error: `Failed to import bookings (batch at row ${i})` },
          { status: 500 }
        );
      }
      inserted += batch.length;
    }

    return NextResponse.json({ success: true, count: inserted });
  } catch (err) {
    console.error("CSV import error:", err);
    return NextResponse.json(
      { error: "Failed to import bookings" },
      { status: 500 }
    );
  }
}
