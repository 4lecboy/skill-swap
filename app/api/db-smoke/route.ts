import { NextResponse } from "next/server";
import { supabaseServerReadOnly } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await supabaseServerReadOnly();
    const { data, error } = await supabase.from("skills").select("*").order("name");

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, count: data?.length ?? 0, skills: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}