import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type SupaCookie = { name: string; value: string; options?: CookieOptions };

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all incoming cookies
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        // Write all cookies Supabase wants to set/refresh
        setAll(cookiesToSet: SupaCookie[]) {
          for (const { name, value, options } of cookiesToSet) {
            res.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Touch the session so expired sessions are refreshed and cookies are updated on `res`
  await supabase.auth.getSession();

  return res;
}

// Limit middleware to routes that need session handling
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/db-smoke).*)"],
};