import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  enabled: !!process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Keep this conservative to stay lean; adjust later if needed
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  // Keep replays off for now (you can enable later)
  replaysOnErrorSampleRate: 0.0,
  replaysSessionSampleRate: 0.0,
});