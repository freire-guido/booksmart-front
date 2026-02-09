import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { fetchWithCloudRunAuth } from "@/lib/cloud-run-fetch";

export async function POST(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: user, error: userError } = await supabase
    .from("gmail_accounts")
    .select("id, organization_id, email, google_access_token, google_refresh_token")
    .eq("email", session)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { email_addresses } = body;

    if (!Array.isArray(email_addresses) || email_addresses.length === 0) {
      return NextResponse.json(
        { error: "At least one email address is required" },
        { status: 400 }
      );
    }

    // Save email sources
    const emailSourceRows = email_addresses.map((addr: string) => {
      const defaultSource = [
        "automated@airbnb.com",
        "booking@t1.viator.com",
        "do-not-reply@notification.getyourguide.com",
        "no-reply@meitre.com",
      ];
      return {
        organization_id: user.organization_id,
        email_address: addr,
        is_default: defaultSource.includes(addr),
      };
    });

    await supabase.from("email_sources").insert(emailSourceRows);

    // Trigger Cloud Run batch service
    const batchUrl = process.env.BATCH_URL;
    if (!batchUrl) {
      return NextResponse.json(
        { error: "Batch service not configured" },
        { status: 500 }
      );
    }

    const sinceDate = new Date();
    sinceDate.setFullYear(sinceDate.getFullYear() - 1);

    const batchHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.BATCH_API_KEY) {
      batchHeaders["x-batch-api-key"] = process.env.BATCH_API_KEY;
    }

    const batchRes = await fetchWithCloudRunAuth(`${batchUrl}/scan`, {
      method: "POST",
      headers: batchHeaders,
      body: JSON.stringify({
        user_email: user.email,
        access_token: user.google_access_token,
        refresh_token: user.google_refresh_token,
        email_addresses,
        since_date: sinceDate.toISOString().split("T")[0],
        organization_id: user.organization_id,
      }),
    });

    const responseText = await batchRes.text();
    if (!batchRes.ok) {
      let batchData: { error?: string } = {};
      try {
        batchData = JSON.parse(responseText);
      } catch {
        // Non-JSON response (e.g. HTML 403 from Cloud Run)
        if (batchRes.status === 403) {
          batchData = {
            error:
              "Batch service returned 403 Forbidden. The scan service may require authentication. Allow invocations in Cloud Run IAM or use an authenticated client.",
          };
          console.error(
            "Batch 403: allow unauthenticated invocations with: gcloud run services add-iam-policy-binding SERVICE_NAME --region=us-central1 --member=allUsers --role=roles/run.invoker"
          );
        } else {
          batchData = { error: responseText.slice(0, 200) || `HTTP ${batchRes.status}` };
        }
      }
      console.error("Batch error:", batchRes.status, batchData);
      return NextResponse.json(
        { error: batchData.error ?? "Failed to start email scanning" },
        { status: 500 }
      );
    }

    let batchData: { job_id?: number | null; email_count?: number } = {};
    try {
      batchData = JSON.parse(responseText);
    } catch {
      // 202 with empty or non-JSON body
    }
    return NextResponse.json({
      success: true,
      job_id: batchData.job_id ?? null,
      email_count: batchData.email_count ?? 0,
    });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "Failed to start scanning" },
      { status: 500 }
    );
  }
}
