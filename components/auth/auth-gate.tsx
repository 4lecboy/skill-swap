"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Always allow auth routes (sign-in, callback) to render
  if (isAuthRoute) return <>{children}</>;

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAuthed) {
    return (
      <main className="mx-auto grid min-h-[60vh] w-full max-w-lg place-items-center p-6">
        <section className="w-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h1 className="mb-2 text-xl font-semibold">Welcome to SkillSwap</h1>
          <p className="mb-6 text-sm text-muted-foreground">Sign in to continue.</p>
          <div className="flex items-center gap-3">
            <a href="/auth/sign-in">
              <Button size="sm">Sign in</Button>
            </a>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}