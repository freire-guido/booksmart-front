import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: job, error } = await supabase
    .from("batch_jobs")
    .select("id, total_emails")
    .eq("user_email", session)
    .eq("status", "submitted")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching pending batch job:", error);
    return NextResponse.json(
      { error: "Failed to check pending job" },
      { status: 500 }
    );
  }

  if (!job) {
    return NextResponse.json({ job_id: null, email_count: 0 });
  }

  return NextResponse.json({
    job_id: job.id,
    email_count: job.total_emails ?? 0,
  });
}
