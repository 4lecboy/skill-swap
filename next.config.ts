import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const useSentry = !!process.env.SENTRY_DSN;

module.exports = useSentry
  ? withSentryConfig(nextConfig, {
      silent: true,
    })
  : nextConfig;

export default nextConfig;
