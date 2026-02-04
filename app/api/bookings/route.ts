import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  // Get user ID from gmail_accounts
  const { data: user, error: userError } = await supabase
    .from("gmail_accounts")
    .select("id")
    .eq("email", session)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch bookings for this user
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(`
      id,
      platform,
      guest_name,
      guest_count,
      booking_date,
      booking_time,
      status,
      activity_name,
      dietary_restrictions,
      special_requests,
      email_id,
      email_subject,
      email_preview,
      email_received_at
    `)
    .eq("user_id", user.id)
    .order("booking_date", { ascending: true });

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }

  return NextResponse.json({ bookings: bookings || [] });
}
