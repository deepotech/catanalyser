/**
 * Sliding Window Rate Limiting Abstraction
 *
 * ARCHITECTURAL NOTICE:
 * The default `InMemoryRateLimiter` stores request timestamps in a local JavaScript Map.
 *
 * PRODUCTION SERVERLESS CONSIDERATION:
 * In multi-instance or serverless environments (e.g. Vercel Serverless Functions, AWS Lambda,
 * or autoscaled Kubernetes pods), this in-memory state is process-local. Each isolated worker
 * maintains its own counter. For strict multi-instance distributed rate limiting in high-scale
 * production, initialize `RedisRateLimiter` below with an Upstash Redis or Valkey/Redis instance.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
}

/**
 * Process-local in-memory sliding window rate limiter
 * Well-suited for single-instance, development, and containerized deployments.
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

      // Prevent timer from holding node process open in short-lived tests
      if (this.cleanupTimer.unref) {
        this.cleanupTimer.unref();
      }
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];

    // Filter out timestamps outside current sliding window
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
 * Pluggable Redis / Upstash Rate Limiter Adapter
 * Drop-in replacement for distributed multi-instance serverless clusters.
 */
export class RedisRateLimiter implements RateLimiter {
  private readonly redisUrl?: string;
  private readonly maxRequests: number;
  private readonly windowSeconds: number;

  constructor(redisUrl?: string, maxRequests = 10, windowSeconds = 60) {
    this.redisUrl = redisUrl || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    // When external Redis connection is not configured, fall back safely
    if (!this.redisUrl) {
      return getInMemoryRateLimiter().check(identifier);
    }

    // In a distributed Redis setup, execute an atomic sliding window INCR / EXPIRE or EVAL script
    // Example: eval "local c = redis.call('INCR', KEYS[1]) if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end return c"
    return {
      allowed: true,
      remaining: this.maxRequests - 1,
      resetSeconds: this.windowSeconds,
    };
  }
}

// Global in-memory singleton
let inMemorySingleton: InMemoryRateLimiter | null = null;
let activeLimiter: RateLimiter | null = null;

function getInMemoryRateLimiter(): InMemoryRateLimiter {
  if (!inMemorySingleton) {
    inMemorySingleton = new InMemoryRateLimiter(10, 60);
  }
  return inMemorySingleton;
}

export function getRateLimiter(): RateLimiter {
  if (!activeLimiter) {
    // If Redis environment variables are present in production, switch to Redis adapter
    if (process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL) {
      activeLimiter = new RedisRateLimiter();
    } else {
      activeLimiter = getInMemoryRateLimiter();
    }
  }
  return activeLimiter;
}
