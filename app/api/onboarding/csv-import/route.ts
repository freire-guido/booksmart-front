import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

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

    // Map to database rows
    const rows = bookings.map((b: Record<string, unknown>, i: number) => ({
      organization_id: user.organization_id,
      created_by_user_id: user.id,
      guest_name: b.guest_name || "Unknown Guest",
      guest_count: typeof b.guest_count === "number" ? b.guest_count : 1,
      booking_date: b.booking_date || new Date().toISOString().split("T")[0],
      booking_time: b.booking_time || null,
      platform: b.platform || "other",
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
    }));

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
