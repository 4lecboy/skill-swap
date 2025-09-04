// Minimal health endpoint for uptime checks
// Returns 200 with "ok" and no-store caching.
// Implemented as a route handler to bypass layout/auth/UI cost.

export function GET() {
  return new Response("ok", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "cache-control": "no-store",
    },
  });
}