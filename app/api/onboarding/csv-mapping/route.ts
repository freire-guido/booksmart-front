import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("booksmart_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lines } = body;

    if (!lines || typeof lines !== "string") {
      return NextResponse.json(
        { error: "CSV lines are required" },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a data mapping assistant. Given these CSV headers and sample data rows, map each column to the most appropriate booking field.

Available booking fields:
- guest_name: Name of the guest
- guest_count: Number of guests (integer)
- booking_date: Date of the booking
- booking_time: Time of the booking
- platform: Booking platform (airbnb, viator, getyourguide, civitatis, tripadvisor, booking_com, expedia, meitre, other)
- activity_name: Name of the experience/activity
- dietary_restrictions: Dietary requirements
- special_requests: Special requests from guest
- status: Booking status (confirmed, pending, cancelled, rescheduled)

If a column doesn't clearly map to any field, set booking_field to null.

Return ONLY valid JSON:
{ "mapping": [{ "csv_column": "Header Name", "booking_field": "field_name" | null }] }`,
        },
        {
          role: "user",
          content: `CSV data:\n${lines}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate mapping" },
        { status: 500 }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("CSV mapping error:", err);
    return NextResponse.json(
      { error: "Failed to generate column mapping" },
      { status: 500 }
    );
  }
}
