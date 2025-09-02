import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type SupaCookie = { name: string; value: string; options?: CookieOptions };

// Use this in Route Handlers or Server Actions (where cookie writes are allowed)
export async function supabaseServerWithCookies() {
  const cookieStore = await cookies();

  // In some contexts the cookie store is read-only. For places where writes are allowed
  // (Route Handlers / Server Actions), Next exposes a mutable cookie store under the hood.
  // We cast narrowly to a type that has `set` so TS allows it, without using `any`.
  type MutableCookies = { set: (name: string, value: string, options?: CookieOptions) => void };
  const mutable = cookieStore as unknown as MutableCookies;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet: SupaCookie[]) {
          for (const { name, value, options } of cookiesToSet) {
            mutable.set(name, value, options);
          }
        },
      },
    }
  );
}

// Use this in Server Components (read-only, no cookie writes)
export async function supabaseServerReadOnly() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        // No-op in Server Components where writes are not allowed
        setAll() {},
      },
    }
  );
}