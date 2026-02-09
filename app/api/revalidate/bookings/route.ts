import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let organizationId: string | null = null;
  try {
    const body = await request.json().catch(() => ({}));
    organizationId = typeof body?.organization_id === "string" ? body.organization_id : null;
  } catch {
    // no body or invalid JSON
  }

  if (organizationId) {
    revalidateTag(`bookings-${organizationId}`, "max");
  } else {
    revalidateTag("bookings", "max");
  }
  revalidatePath("/dashboard", "page");

  return NextResponse.json({ revalidated: true, organization_id: organizationId ?? undefined });
}
