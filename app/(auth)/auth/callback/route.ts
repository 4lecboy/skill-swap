import { NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/account/profile";
  const supabase = await supabaseServerWithCookies();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, url.origin)
      );
    }
  }
  return NextResponse.redirect(new URL(next, url.origin));
}