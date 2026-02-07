import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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

  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", user.organization_id);

  if (countError) {
    console.error("Error counting bookings:", countError);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }

  return NextResponse.json({ count: count || 0 });
}
