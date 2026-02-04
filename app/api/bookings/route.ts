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
      email_received_at,
      extraction_confidence,
      manually_reviewed
    `)
    .eq("user_id", user.id)
    .order("booking_date", { ascending: true });

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }

  return NextResponse.json({ bookings: bookings || [] });
}

export async function POST(request: NextRequest) {
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
    const { 
      guest_name, 
      guest_count, 
      booking_date, 
      booking_time, 
      platform, 
      dietary_restrictions, 
      special_requests, 
      activity_name, 
      status 
    } = body;

    // Validate required fields
    if (!guest_name || !booking_date) {
      return NextResponse.json(
        { error: "Guest name and booking date are required" }, 
        { status: 400 }
      );
    }

    // Generate a unique email_id for manual bookings
    const manualEmailId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the booking
    const { data: newBooking, error: createError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        guest_name,
        guest_count: guest_count || 1,
        booking_date,
        booking_time: booking_time || null,
        platform: platform || 'other',
        dietary_restrictions: dietary_restrictions || null,
        special_requests: special_requests || null,
        activity_name: activity_name || null,
        status: status || 'confirmed',
        email_id: manualEmailId,
        email_subject: 'Manual booking',
        email_preview: 'This booking was created manually',
        email_received_at: new Date().toISOString(),
        extraction_confidence: 1.0,
        manually_reviewed: true,
      })
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
        email_received_at,
        extraction_confidence,
        manually_reviewed
      `)
      .single();

    if (createError) {
      console.error("Error creating booking:", createError);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
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
    const { id, guest_name, guest_count, booking_date, booking_time, platform, dietary_restrictions, special_requests, activity_name, status, manually_reviewed } = body;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // First fetch the existing booking to compare changes
    const { data: existingBooking, error: findError } = await supabase
      .from("bookings")
      .select(`
        id,
        guest_name,
        guest_count,
        booking_date,
        booking_time,
        platform,
        dietary_restrictions,
        special_requests,
        activity_name,
        status,
        manually_reviewed
      `)
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
    if (manually_reviewed !== undefined) updateData.manually_reviewed = manually_reviewed;

    // Track changes for audit log
    const changes: Record<string, { old: unknown; new: unknown }> = {};
    const fieldsToTrack = [
      'guest_name', 'guest_count', 'booking_date', 'booking_time', 
      'platform', 'dietary_restrictions', 'special_requests', 
      'activity_name', 'status'
    ] as const;

    for (const field of fieldsToTrack) {
      if (updateData[field] !== undefined) {
        const oldValue = existingBooking[field];
        const newValue = updateData[field];
        
        // Only log if the value actually changed
        const oldStr = JSON.stringify(oldValue);
        const newStr = JSON.stringify(newValue);
        if (oldStr !== newStr) {
          changes[field] = { old: oldValue, new: newValue };
        }
      }
    }

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
        email_received_at,
        extraction_confidence,
        manually_reviewed
      `)
      .single();

    if (updateError) {
      console.error("Error updating booking:", updateError);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // Log to manual_edits audit table if there were actual changes
    if (Object.keys(changes).length > 0) {
      const userAgent = request.headers.get("user-agent") || null;
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

      const { error: auditError } = await supabase
        .from("manual_edits")
        .insert({
          booking_id: id,
          user_id: user.id,
          changes,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (auditError) {
        // Log but don't fail the request - audit is secondary
        console.error("Error logging manual edit:", auditError);
      }
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
