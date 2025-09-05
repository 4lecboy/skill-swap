"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Link = { label: string; url: string };
type Profile = {
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  languages?: string[] | null;
  timezone?: string | null;
  location?: string | null;
  links?: Link[] | null;
};

export default function ProfileForm({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: Profile | null;
}) {
  const supabase = supabaseBrowser();
  const [profile, setProfile] = useState<Profile>(initialProfile ?? {});
  const [website, setWebsite] = useState<string>(() => {
    const first = initialProfile?.links?.[0]?.url ?? "";
    return typeof first === "string" ? first : "";
  });
  const [langsText, setLangsText] = useState<string>(
    (initialProfile?.languages ?? []).join(", ")
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect timezone for new users
  useEffect(() => {
    if (!profile.timezone) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) setProfile((p) => ({ ...p, timezone: tz }));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile((p) => ({ ...p, avatar_url: data.publicUrl }));
    setMessage("Avatar uploaded.");
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setMessage(null);

    // Normalize fields
    const languages = langsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const links: Link[] = website ? [{ label: "website", url: website }] : [];

    // Basic username normalization (URL-safe-ish)
    const normalizedUsername = (profile.username ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 32);

    const payload: Profile & { id: string } = {
      id: userId,
      username: normalizedUsername || null,
      full_name: profile.full_name ?? null,
      avatar_url: profile.avatar_url ?? null,
      bio: profile.bio ?? null,
      languages,
      timezone: profile.timezone ?? null,
      location: profile.location ?? null,
      links,
    };

    const { error } = await supabase.from("profiles").upsert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Profile saved.");
      setProfile((p) => ({ ...p, ...payload }));
    }
  }

  // Required fields with strong typing
  const requiredFields: (keyof Profile)[] = [
    "username",
    "full_name",
    "bio",
    "avatar_url",
  ];
  const completed = requiredFields.filter((k) =>
    Boolean(profile[k as keyof Profile])
  ).length;
  const pct = Math.round((completed / requiredFields.length) * 100);

  return (
    <main className="mx-auto max-w-xl p-4">
      <div className="mb-4 text-sm text-muted-foreground">
        Profile completeness: {pct}%
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Avatar</label>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="avatar preview"
              className="mb-2 h-16 w-16 rounded-full object-cover"
            />
          ) : null}
          <input type="file" accept="image/*" onChange={onAvatarChange} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <Input
            value={profile.username ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, username: e.target.value }))
            }
            placeholder="yourname"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            a–z, 0–9, underscore or dash; max 32 chars
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <Input
            value={profile.full_name ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, full_name: e.target.value }))
            }
            placeholder="Ada Lovelace"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea
            className="w-full min-h-[96px] rounded-md border bg-background p-2 text-sm"
            value={profile.bio ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, bio: e.target.value }))
            }
            placeholder="Short intro about you…"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Languages (comma separated)
          </label>
          <Input
            value={langsText}
            onChange={(e) => setLangsText(e.target.value)}
            placeholder="English, Spanish"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Timezone</label>
          <Input
            value={profile.timezone ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, timezone: e.target.value }))
            }
            placeholder="America/Los_Angeles"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <Input
            value={profile.location ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, location: e.target.value }))
            }
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Website</label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {message ? (
            <span className="text-sm text-foreground">{message}</span>
          ) : null}
          {error ? <span className="text-sm text-destructive">{error}</span> : null}
        </div>

        {profile.username ? (
          <div className="text-sm">
            Public profile:{" "}
            <a
              className="text-primary underline"
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noreferrer"
            >
              /u/{profile.username}
            </a>
          </div>
        ) : null}
      </div>
    </main>
  );
}