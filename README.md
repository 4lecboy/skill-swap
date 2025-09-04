# SkillSwap

A Next.js app (App Router) with Tailwind CSS + shadcn/ui, Supabase SSR helpers, and lean observability.

## Quickstart

```bash
# Install dependencies
npm install

# Copy env and fill values
cp .env.example .env.local
# Add:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# Optional:
# SENTRY_DSN
# NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE

# Dev
npm run dev
```

## Verify setup

- Tailwind/shadcn demo: http://localhost:3000/tw-check
- Health endpoint (200, plain text): http://localhost:3000/health
- DB smoke test (if schema seeded): http://localhost:3000/api/db-smoke

## Day 1 notes

- Tailwind CSS @latest configured with design tokens (CSS variables) and shadcn/ui components (Button, Input, Select, Dialog).
- App shell with mobile header and AuthGate stub (Sign in / Continue placeholders).
- Health endpoint at /health for uptime checks (bypasses UI/auth).
- Supabase SSR + observability (Sentry, Vercel Analytics/Speed Insights) scaffolding available; enable via env vars as needed.

## Next steps (Day 2)

- Wire Supabase auth into AuthGate (session detection, sign-in flow).
- Expand tokens and component library as design solidifies.
- Add middleware exclusions for health if desired (see Tips).

## Tips

- If you use an uptime checker, prefer GET /health (implemented as a route handler to avoid layout/auth).
- To avoid any middleware overhead on health checks, add /health to the middleware matcher exclusions.