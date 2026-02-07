import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const supabase = createServerClient();
  const { data: row } = await supabase
    .from("gmail_accounts")
    .select("id, email, name, picture, organization_id, organizations(onboarding_completed)")
    .eq("email", session)
    .single();

  const user = row
    ? {
        id: row.id,
        email: row.email,
        name: row.name,
        picture: row.picture,
        onboarding_completed:
          (row as { organizations?: { onboarding_completed: boolean } | null })
            .organizations?.onboarding_completed ?? false,
      }
    : null;

  return NextResponse.json({ user });
}
