/**
 * Small in-memory sliding-window rate limiter for abuse-prone endpoints
 * (OTP send / verify). Per server process: with several processes each one
 * keeps its own counts, so the effective limit is limit × processes — still
 * enough to make OTP guessing and SMS/WhatsApp bombing impractical.
 */

const buckets = new Map<string, number[]>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, hits] of buckets) {
    // Drop buckets whose newest hit is older than the longest window we use (1h)
    if (!hits.length || now - hits[hits.length - 1] > 60 * 60 * 1000) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the next attempt is allowed (0 when ok) */
  retryAfter: number;
}

/** Records one hit for `key` and reports whether it is within `limit` per `windowMs`. */
export function hitRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((hits[0] + windowMs - now) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfter: 0 };
}

/** Checks the limit for `key` without recording a hit. */
export function isRateLimited(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) return { ok: false, retryAfter: Math.ceil((hits[0] + windowMs - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Best-effort client IP behind nginx / Cloudflare. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function tooManyRequests(retryAfter: number, message: string) {
  return Response.json(
    { success: false, error: message, retryAfter },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
