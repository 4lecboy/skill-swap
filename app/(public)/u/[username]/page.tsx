import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServerReadOnly } from "@/lib/supabase/server";

export const revalidate = 60;

type Link = { label?: string | null; url: string };

async function getProfileByUsername(username: string) {
  const supabase = await supabaseServerReadOnly();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, avatar_url, bio, languages, timezone, location, links"
    )
    .eq("username", username)
    .maybeSingle();

  if (error) {
    // If the table exists and query fails for some reason, surface notFound
    return null;
  }
  return data as
    | {
        id: string;
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        bio: string | null;
        languages: string[] | null;
        timezone: string | null;
        location: string | null;
        links: Link[] | null;
      }
    | null;
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfileByUsername(params.username);
  if (!profile) {
    return {
      title: "Profile not found",
      description: "The requested profile could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const titleBase =
    profile.full_name && profile.username
      ? `${profile.full_name} (@${profile.username})`
      : profile.username
      ? `@${profile.username}`
      : "User";

  const desc =
    (profile.bio ?? "").slice(0, 160) ||
    `View ${titleBase}'s public SkillSwap profile.`;

  const images = profile.avatar_url ? [profile.avatar_url] : [];

  return {
    title: `${titleBase} • SkillSwap`,
    description: desc,
    alternates: { canonical: `/u/${params.username}` },
    openGraph: {
      title: `${titleBase} • SkillSwap`,
      description: desc,
      type: "profile",
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: `${titleBase} • SkillSwap`,
      description: desc,
      images,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfileByUsername(params.username);
  if (!profile) notFound();

  const links = Array.isArray(profile.links) ? profile.links : [];
  const languages = Array.isArray(profile.languages) ? profile.languages : [];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-start gap-4">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={`${profile.full_name ?? profile.username ?? "User"} avatar`}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-xl font-semibold uppercase">
            {(profile.full_name ?? profile.username ?? "?").slice(0, 1)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {profile.full_name || profile.username || "User"}
          </h1>
          {profile.username ? (
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {profile.location ? <span>📍 {profile.location}</span> : null}
            {profile.timezone ? <span>🕒 {profile.timezone}</span> : null}
          </div>
        </div>
      </header>

      {profile.bio ? (
        <section className="prose prose-sm max-w-none dark:prose-invert">
          <p>{profile.bio}</p>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">No bio yet.</p>
      )}

      {languages.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-medium">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border px-2 py-0.5 text-xs"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {links.length ? (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-medium">Links</h2>
          <ul className="space-y-1 text-sm">
            {links.map((l, i) => {
              const label =
                (typeof l.label === "string" && l.label) || "link";
              const url = l.url;
              if (typeof url !== "string" || !url) return null;
              return (
                <li key={`${label}-${i}`}>
                  <a
                    href={url}
                    className="text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}