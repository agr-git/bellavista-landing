/**
 * In-memory token-bucket rate limiter.
 *
 * 5 requests per 60 seconds per IP. In-memory is sufficient for the
 * single-instance Lightsail deployment target (ADR-004). If we ever
 * scale horizontally, swap this for Upstash Redis behind the same API.
 *
 * Do NOT keep this map on the module global across a dev-reload HMR
 * cycle without tolerance — the counter resets per process, which is
 * fine for our traffic profile.
 */

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const LIMIT = 5;
const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string): { ok: boolean; retryMs: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now >= b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryMs: 0 };
  }
  if (b.count >= LIMIT) {
    return { ok: false, retryMs: b.resetAt - now };
  }
  b.count += 1;
  return { ok: true, retryMs: 0 };
}

/** Best-effort IP from Next.js request headers. */
export function clientIp(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
