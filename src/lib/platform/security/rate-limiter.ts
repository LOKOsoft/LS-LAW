type Bucket = { count: number; windowStartMs: number };

/**
 * In-memory fixed-window rate limiter. Real protection for a single local
 * process; resets on restart and isn't shared across instances — replace
 * with a Redis-backed limiter (same `RateLimiter` shape) before running more
 * than one server instance, or a real brute-force attempt would just reset
 * its counter by hitting a different instance.
 */
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Returns true if the call is allowed, false if the key has exceeded its limit within the current window. */
  check(key: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now - bucket.windowStartMs >= this.windowMs) {
      this.buckets.set(key, { count: 1, windowStartMs: now });
      return true;
    }

    if (bucket.count >= this.limit) return false;
    bucket.count += 1;
    return true;
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }
}

/** Shared instance guarding login attempts — 10 tries per 5 minutes per email, generous enough not to disrupt normal/demo use but enough to blunt a scripted brute force. */
export const loginRateLimiter = new RateLimiter(10, 5 * 60 * 1000);
