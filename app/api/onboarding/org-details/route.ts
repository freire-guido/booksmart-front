import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await request.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Organisation name is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data: account } = await supabase
    .from("gmail_accounts")
    .select("organization_id")
    .eq("email", session)
    .single();

  if (!account?.organization_id) {
    return NextResponse.json(
      { error: "No organization for this account" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("organizations")
    .update({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : null,
    })
    .eq("id", account.organization_id);

  if (error) {
    console.error("Error updating org details:", error);
    return NextResponse.json(
      { error: "Failed to update organisation details" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
