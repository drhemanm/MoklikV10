import { z } from 'zod';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number;  // Maximum attempts per window
  blockDuration: number;  // How long to block after max attempts (ms)
}

interface RateLimitInfo {
  attempts: number;
  firstAttempt: number;
  blocked?: boolean;
  blockExpires?: number;
}

// In-memory store for development
// In production, use Redis or similar
const store = new Map<string, RateLimitInfo>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of store.entries()) {
    if (info.blockExpires && info.blockExpires < now) {
      store.delete(ip);
    }
  }
}, 60000); // Clean up every minute

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      maxAttempts: config.maxAttempts || 5, // 5 attempts
      blockDuration: config.blockDuration || 60 * 60 * 1000, // 1 hour
    };
  }

  isRateLimited(ip: string): { limited: boolean; remainingAttempts: number; msBeforeNext: number } {
    const now = Date.now();
    const info = store.get(ip) || { attempts: 0, firstAttempt: now };

    // Check if IP is blocked
    if (info.blocked && info.blockExpires && info.blockExpires > now) {
      return {
        limited: true,
        remainingAttempts: 0,
        msBeforeNext: info.blockExpires - now
      };
    }

    // Reset if window has expired
    if (now - info.firstAttempt > this.config.windowMs) {
      store.set(ip, { attempts: 1, firstAttempt: now });
      return {
        limited: false,
        remainingAttempts: this.config.maxAttempts - 1,
        msBeforeNext: 0
      };
    }

    // Check if max attempts reached
    if (info.attempts >= this.config.maxAttempts) {
      store.set(ip, {
        ...info,
        blocked: true,
        blockExpires: now + this.config.blockDuration
      });
      return {
        limited: true,
        remainingAttempts: 0,
        msBeforeNext: this.config.blockDuration
      };
    }

    // Increment attempts
    store.set(ip, {
      ...info,
      attempts: info.attempts + 1
    });

    return {
      limited: false,
      remainingAttempts: this.config.maxAttempts - (info.attempts + 1),
      msBeforeNext: this.config.windowMs - (now - info.firstAttempt)
    };
  }

  reset(ip: string): void {
    store.delete(ip);
  }
}