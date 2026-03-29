import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Create a per-request client with the user's auth token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trend_data } = body;

    if (!trend_data || !trend_data.trend_id) {
      return NextResponse.json(
        { error: "Valid trend_data is required" },
        { status: 400 }
      );
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from("saved_items")
      .select("id")
      .eq("user_id", user.id)
      .filter("trend_data->>trend_id", "eq", trend_data.trend_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Trend already saved" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("saved_items")
      .insert({
        user_id: user.id,
        item_type: "trend",
        trend_data,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Save trend error:", error);
    return NextResponse.json(
      { error: "Failed to save trend" },
      { status: 500 }
    );
  }
}
