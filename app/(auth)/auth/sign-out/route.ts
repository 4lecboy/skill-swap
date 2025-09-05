import { NextResponse } from "next/server";
import { supabaseServerWithCookies } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabase = await supabaseServerWithCookies();
  await supabase.auth.signOut();
  const next = url.searchParams.get("next") || "/auth/sign-in";
  return NextResponse.redirect(new URL(next, url.origin));
}