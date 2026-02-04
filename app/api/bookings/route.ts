import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

type Platform = 'airbnb' | 'viator' | 'getyourguide' | 'civitatis' | 'tripadvisor' | 'booking_com' | 'expedia' | 'meitre' | 'other';

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

export async function PATCH(request: NextRequest) {
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

  try {
    const body = await request.json();
    const { id, guest_name, guest_count, booking_date, booking_time, platform, dietary_restrictions, special_requests, activity_name, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // First verify the booking belongs to this user
    const { data: existingBooking, error: findError } = await supabase
      .from("bookings")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (findError || !existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (guest_name !== undefined) updateData.guest_name = guest_name;
    if (guest_count !== undefined) updateData.guest_count = guest_count;
    if (booking_date !== undefined) updateData.booking_date = booking_date;
    if (booking_time !== undefined) updateData.booking_time = booking_time;
    if (platform !== undefined) updateData.platform = platform as Platform;
    if (dietary_restrictions !== undefined) updateData.dietary_restrictions = dietary_restrictions;
    if (special_requests !== undefined) updateData.special_requests = special_requests;
    if (activity_name !== undefined) updateData.activity_name = activity_name;
    if (status !== undefined) updateData.status = status;

    // Update the booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
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
      .single();

    if (updateError) {
      console.error("Error updating booking:", updateError);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
