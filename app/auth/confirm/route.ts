import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "signup";

  if (token_hash) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.error("Auth confirm error:", error);
  }

  return NextResponse.redirect(new URL("/auth/login?error=confirmation", request.url));
}
