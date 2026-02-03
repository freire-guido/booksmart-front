import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const supabase = createServerClient();
  const { data: user } = await supabase
    .from("gmail_accounts")
    .select("email, name, picture")
    .eq("email", session)
    .single();

  return NextResponse.json({ user: user || null });
}
