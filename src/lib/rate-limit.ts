import type { Request, Response, NextFunction } from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  exponentialBackoff?: boolean;
  baseDelayMs?: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
  violations: number; // Used for exponential backoff
}

export class AdvancedRateLimiter {
  private tracker = new Map<string, RateLimitRecord>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      baseDelayMs: 1000 * 60, // 1 minute base penalty
      ...config,
    };

    // Cleanup stale records periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.tracker.entries()) {
        if (now > record.resetTime) {
          this.tracker.delete(key);
        }
      }
    }, this.config.windowMs * 2).unref?.();
  }

  private processRequest(identifier: string): { allowed: boolean; remaining: number; resetTime: number; retryAfterSeconds: number } {
    const now = Date.now();
    let record = this.tracker.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or expired window
      record = {
        count: 1,
        resetTime: now + this.config.windowMs,
        violations: 0,
      };
      this.tracker.set(identifier, record);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: record.resetTime,
        retryAfterSeconds: 0,
      };
    }

    if (record.count >= this.config.maxRequests) {
      // Violation!
      record.violations += 1;
      
      // Calculate delay based on exponential backoff if enabled
      let delayMs = this.config.windowMs;
      if (this.config.exponentialBackoff) {
        // Base delay * (2 ^ (violations - 1))
        delayMs = (this.config.baseDelayMs || 60000) * Math.pow(2, record.violations - 1);
      }
      
      record.resetTime = now + delayMs;
      this.tracker.set(identifier, record);

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfterSeconds: Math.ceil(delayMs / 1000),
      };
    }

    record.count += 1;
    this.tracker.set(identifier, record);

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime,
      retryAfterSeconds: 0,
    };
  }

  private getClientIp(req: Request | VercelRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(",")[0].trim();
    }
    // Express req.ip fallback
    if ('ip' in req && req.ip) return req.ip as string;
    if ('socket' in req && (req.socket as any)?.remoteAddress) return (req.socket as any).remoteAddress;
    return "unknown";
  }

  // Adapter for Express
  public expressMiddleware(getAccountKey?: (req: Request) => string | undefined) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const ip = this.getClientIp(req);
      const accountKey = getAccountKey ? getAccountKey(req) : undefined;
      const identifier = accountKey ? `${ip}::${accountKey}` : ip;

      const result = this.processRequest(identifier);

      res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
      res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTime / 1000).toString());

      if (!result.allowed) {
        res.setHeader("Retry-After", result.retryAfterSeconds.toString());
        res.status(429).json({
          error: "Too many requests, please try again later.",
          retryAfterSeconds: result.retryAfterSeconds,
        });
        return;
      }

      next();
    };
  }

  // Adapter for Vercel Serverless Functions
  public vercelHandler(handler: (req: VercelRequest, res: VercelResponse) => Promise<any> | any, getAccountKey?: (req: VercelRequest) => string | undefined) {
    return async (req: VercelRequest, res: VercelResponse) => {
      const ip = this.getClientIp(req);
      const accountKey = getAccountKey ? getAccountKey(req) : undefined;
      const identifier = accountKey ? `${ip}::${accountKey}` : ip;

      const result = this.processRequest(identifier);

      res.setHeader("X-RateLimit-Limit", this.config.maxRequests.toString());
      res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTime / 1000).toString());

      if (!result.allowed) {
        res.setHeader("Retry-After", result.retryAfterSeconds.toString());
        return res.status(429).json({
          error: "Too many requests, please try again later.",
          retryAfterSeconds: result.retryAfterSeconds,
        });
      }

      return handler(req, res);
    };
  }
}

// Configurable Thresholds (can be overridden by process.env)
export const RATE_LIMIT_THRESHOLDS = {
  auth: {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "60000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQS || "5", 10),
    exponentialBackoff: true,
    baseDelayMs: parseInt(process.env.RATE_LIMIT_AUTH_BASE_DELAY_MS || "60000", 10), // 1 min base backoff
  },
  public: {
    windowMs: parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS || "60000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX_REQS || "60", 10),
  },
  authenticated: {
    windowMs: parseInt(process.env.RATE_LIMIT_AUTHED_WINDOW_MS || "60000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_AUTHED_MAX_REQS || "300", 10),
  }
};

// Singleton instances for shared state in the same process
export const strictAuthLimiter = new AdvancedRateLimiter(RATE_LIMIT_THRESHOLDS.auth);
export const publicLimiter = new AdvancedRateLimiter(RATE_LIMIT_THRESHOLDS.public);
export const looseAuthLimiter = new AdvancedRateLimiter(RATE_LIMIT_THRESHOLDS.authenticated);
