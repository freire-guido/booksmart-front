import { NextRequest, NextResponse } from "next/server";
import { fetchWithCloudRunAuth } from "@/lib/cloud-run-fetch";

export async function POST(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { job_id } = body;

    if (!job_id) {
      return NextResponse.json({ error: "Missing job_id" }, { status: 400 });
    }

    const batchUrl = process.env.BATCH_URL;
    if (!batchUrl) {
      return NextResponse.json(
        { error: "Batch service not configured" },
        { status: 500 }
      );
    }

    const batchHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.BATCH_API_KEY) {
      batchHeaders["x-batch-api-key"] = process.env.BATCH_API_KEY;
    }

    const batchRes = await fetchWithCloudRunAuth(`${batchUrl}/complete`, {
      method: "POST",
      headers: batchHeaders,
      body: JSON.stringify({ job_id }),
    });

    if (!batchRes.ok) {
      const data = await batchRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || "Batch status check failed" },
        { status: batchRes.status }
      );
    }

    const data = await batchRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Batch status error:", err);
    return NextResponse.json(
      { error: "Failed to check batch status" },
      { status: 500 }
    );
  }
}
