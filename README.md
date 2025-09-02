# Skill Swap

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Supabase Integration**: Uses the latest `@supabase/ssr` package for server-side rendering with proper cookie handling
- **Observability**: Integrated with Sentry for error tracking and Vercel Analytics/Speed Insights for performance monitoring
- **Database Health Check**: `/api/db-smoke` endpoint for validating Supabase connectivity

## Environment Setup

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Optional environment variables for observability:
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for error tracking
- `SENTRY_ORG`: Sentry organization name
- `SENTRY_PROJECT`: Sentry project name

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## API Endpoints

- `/api/db-smoke` - Database connectivity health check

## Supabase SSR Configuration

The app uses the new `@supabase/ssr` package with proper cookie handling:

- **Server Components**: Use `supabaseServerReadOnly()` for read-only operations
- **Route Handlers & Server Actions**: Use `supabaseServerWithCookies()` for operations that may write cookies
- **Client Components**: Use `supabaseBrowser()` for browser-side operations

## Observability

### Sentry
Error tracking and performance monitoring is configured via:
- `sentry.client.config.ts` - Client-side Sentry configuration
- `sentry.server.config.ts` - Server-side Sentry configuration
- `sentry.edge.config.ts` - Edge runtime Sentry configuration
- `instrumentation.ts` - Sentry instrumentation hook

### Vercel Analytics
Page analytics and performance insights are automatically enabled when deployed to Vercel.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
