/**
 * Rate Limiting Abstraction for CatAnalyzer.com
 *
 * PRODUCTION DISTRIBUTED STRATEGY:
 * - When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured,
 *   `UpstashRedisRateLimiter` enforces atomic, distributed rate limiting across all serverless
 *   instances/regions using zero-dependency HTTP REST pipelines.
 *
 * DEGRADED FALLBACK STRATEGY:
 * - When Redis credentials are NOT configured or during network timeouts (>1500ms),
 *   the system falls back to `InMemoryRateLimiter`.
 * - IMPORTANT: In-memory limiting is process-local and does NOT provide distributed protection
 *   across multi-instance serverless deployments.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
}

export interface RateLimiterStatus {
  isDistributed: boolean;
  provider: "upstash-redis" | "in-memory";
  description: string;
}

/**
 * Process-local in-memory sliding window rate limiter
 * Degraded fallback for local development or when distributed Redis is unavailable.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(maxRequests = 10, windowSeconds = 60) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;

    // Periodic cleanup of stale IP records every 5 minutes
    if (typeof setInterval !== "undefined") {
      this.cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, timestamps] of this.requests.entries()) {
          const valid = timestamps.filter((t) => now - t < this.windowMs);
          if (valid.length === 0) {
            this.requests.delete(key);
          } else {
            this.requests.set(key, valid);
          }
        }
      }, 5 * 60 * 1000);

      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref();
      }
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      const oldest = validTimestamps[0];
      const resetSeconds = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: Math.max(1, resetSeconds),
      };
    }

    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);

    return {
      allowed: true,
      remaining: this.maxRequests - validTimestamps.length,
      resetSeconds: Math.ceil(this.windowMs / 1000),
    };
  }
}

/**
 * Distributed Upstash Redis REST Rate Limiter
 * Atomic multi-instance protection without external npm dependencies.
 */
export class UpstashRedisRateLimiter implements RateLimiter {
  private readonly redisUrl: string;
  private readonly redisToken: string;
  private readonly maxRequests: number;
  private readonly windowSeconds: number;
  private readonly fallbackLimiter: InMemoryRateLimiter;

  constructor(
    redisUrl: string,
    redisToken: string,
    maxRequests = 10,
    windowSeconds = 60
  ) {
    this.redisUrl = redisUrl.replace(/\/+$/, "");
    this.redisToken = redisToken;
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
    this.fallbackLimiter = new InMemoryRateLimiter(maxRequests, windowSeconds);
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const key = `ratelimit:${identifier.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const endpoint = `${this.redisUrl}/pipeline`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500); // 1.5s fast timeout
    if (timeout.unref) timeout.unref();

    try {
      // Execute INCR + EXPIRE pipeline atomically
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, this.windowSeconds],
          ["TTL", key],
        ]),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(
          `[Rate Limiter Warning] Upstash Redis returned HTTP ${response.status}. Falling back to degraded in-memory limiter.`
        );
        return this.fallbackLimiter.check(identifier);
      }

      const results = (await response.json()) as Array<{ result?: number }>;
      const currentCount = typeof results[0]?.result === "number" ? results[0].result : 1;
      const ttl = typeof results[2]?.result === "number" && results[2].result > 0 ? results[2].result : this.windowSeconds;

      if (currentCount > this.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetSeconds: ttl,
        };
      }

      return {
        allowed: true,
        remaining: Math.max(0, this.maxRequests - currentCount),
        resetSeconds: ttl,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      console.warn(
        `[Rate Limiter Warning] Upstash Redis request failed (${err instanceof Error ? err.message : "network error"}). Degraded in-memory limiting active.`
      );
      return this.fallbackLimiter.check(identifier);
    }
  }
}

// Global Singletons
let inMemorySingleton: InMemoryRateLimiter | null = null;
let activeLimiter: RateLimiter | null = null;

function getInMemoryRateLimiter(maxRequests = 10, windowSeconds = 60): InMemoryRateLimiter {
  if (!inMemorySingleton) {
    inMemorySingleton = new InMemoryRateLimiter(maxRequests, windowSeconds);
  }
  return inMemorySingleton;
}

/**
 * Returns the configured rate limiter.
 * Selects Upstash Redis if credentials exist; otherwise returns in-memory fallback.
 */
export function getRateLimiter(): RateLimiter {
  if (!activeLimiter) {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10) || 10;
    const windowSeconds = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || "60", 10) || 60;

    if (redisUrl && redisToken) {
      activeLimiter = new UpstashRedisRateLimiter(
        redisUrl,
        redisToken,
        maxRequests,
        windowSeconds
      );
    } else {
      activeLimiter = getInMemoryRateLimiter(maxRequests, windowSeconds);
    }
  }
  return activeLimiter;
}

/**
 * Reports current rate limiting status for telemetry and health audits.
 */
export function getRateLimiterStatus(): RateLimiterStatus {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (redisUrl && redisToken) {
    return {
      isDistributed: true,
      provider: "upstash-redis",
      description: "Distributed rate limiting active via Upstash Redis REST.",
    };
  }

  return {
    isDistributed: false,
    provider: "in-memory",
    description:
      "Degraded in-memory rate limiting active (single-instance only). Multi-instance distributed protection is NOT enabled.",
  };
}

/**
 * Resets the rate limiter singleton for testing.
 */
export function resetRateLimiter(): void {
  activeLimiter = null;
  inMemorySingleton = null;
}
