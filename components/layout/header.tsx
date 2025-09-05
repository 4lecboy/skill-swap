"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type SessionUser = { id: string; email?: string | null };

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u as any);

      if (u?.id) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", u.id)
          .maybeSingle();
        setUsername((prof as any)?.username ?? null);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u as any);
        if (u?.id) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", u.id)
            .maybeSingle();
          setUsername((prof as any)?.username ?? null);
        } else {
          setUsername(null);
        }
      }
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          SkillSwap
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/u/featured" className="text-sm text-muted-foreground">
            Explore
          </Link>

          {user ? (
            <>
              <Link href="/account/profile" className="text-sm">
                Edit profile
              </Link>
              {username ? (
                <Link href={`/u/${username}`} className="text-sm">
                  Public profile
                </Link>
              ) : null}
              <a href="/auth/sign-out?next=/" className="text-sm">
                <Button size="sm" variant="outline">
                  Sign out
                </Button>
              </a>
            </>
          ) : (
            <a href="/auth/sign-in">
              <Button size="sm">Sign in</Button>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}