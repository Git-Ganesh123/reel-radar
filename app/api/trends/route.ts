import { NextRequest, NextResponse } from "next/server";
import { getTrendsForNiche } from "@/lib/trend-engine";
import type { TrendsResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { niche } = body;

    if (!niche || typeof niche !== "string") {
      return NextResponse.json(
        { error: "A niche parameter is required" },
        { status: 400 }
      );
    }

    const sanitized = niche.trim().toLowerCase().slice(0, 100);
    const trends = await getTrendsForNiche(sanitized, 10);

    const response: TrendsResponse = {
      trends,
      niche: sanitized,
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Trends API error:", error);
    return NextResponse.json(
      { error: "Failed to generate trends" },
      { status: 500 }
    );
  }
}
