import Link from "next/link";
import { supabaseServerReadOnly } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Profile = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default async function HomePage() {
  const supabase = await supabaseServerReadOnly();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If you're using AuthGate to protect "/", this fallback won't show.
  // Keeping it here makes the page still useful if you later allow "/" to be public.
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="mb-3 text-3xl font-semibold">Welcome to SkillSwap</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Connect, share skills, and learn from others. Sign in to get started.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex h-9 items-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const displayName = profile?.full_name || user.email || "there";

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center gap-4">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="Your avatar"
            className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold uppercase">
            {(displayName || "?").slice(0, 1)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">Hi, {displayName}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Manage your profile or view it publicly.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/profile"
          className="rounded-lg border p-4 hover:bg-muted/50"
        >
          <h2 className="mb-1 text-base font-medium">Edit your profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your name, bio, avatar, languages, and more.
          </p>
        </Link>

        <Link
          href={profile?.username ? `/u/${profile.username}` : "/account/profile"}
          className="rounded-lg border p-4 hover:bg-muted/50"
        >
          <h2 className="mb-1 text-base font-medium">Public profile</h2>
          <p className="text-sm text-muted-foreground">
            {profile?.username
              ? "View how others see your profile."
              : "Pick a username to publish your profile."}
          </p>
        </Link>
      </section>
    </main>
  );
}