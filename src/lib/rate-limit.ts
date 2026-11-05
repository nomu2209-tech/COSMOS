import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket store with automatic cleanup
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
  /** Action / prefix namespace */
  prefix?: string;
}

/**
 * Checks whether an IP or identifier has exceeded the allowed rate limit
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const key = `${options.prefix || "global"}:${identifier}`;

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetInSeconds: options.windowSeconds,
    };
  }

  if (existing.count >= options.limit) {
    const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    allowed: true,
    remaining: options.limit - existing.count,
    resetInSeconds,
  };
}

/**
 * Helper to extract client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Enforces rate limit or returns a standardized 429 Too Many Requests response
 */
export function enforceRateLimit(
  request: Request,
  options: RateLimitOptions
): NextResponse | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, options);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please wait ${result.resetInSeconds} seconds before retrying.`,
        retryAfter: result.resetInSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": result.resetInSeconds.toString(),
          "X-RateLimit-Limit": options.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
