import { RateLimiter } from '../rateLimit';

interface BruteForceConfig {
  maxFailedAttempts: number;
  blockDuration: number;
  monitorWindow: number;
}

export class BruteForceProtection {
  private rateLimiter: RateLimiter;
  private suspiciousIPs: Set<string> = new Set();
  private config: BruteForceConfig;

  constructor(config?: Partial<BruteForceConfig>) {
    this.config = {
      maxFailedAttempts: config?.maxFailedAttempts || 3,
      blockDuration: config?.blockDuration || 24 * 60 * 60 * 1000, // 24 hours
      monitorWindow: config?.monitorWindow || 30 * 60 * 1000 // 30 minutes
    };

    this.rateLimiter = new RateLimiter({
      windowMs: this.config.monitorWindow,
      maxAttempts: this.config.maxFailedAttempts,
      blockDuration: this.config.blockDuration
    });
  }

  checkAttempt(ip: string, userAgent: string): { blocked: boolean; reason?: string } {
    // Check rate limiting
    const rateLimit = this.rateLimiter.isRateLimited(ip);
    if (rateLimit.limited) {
      return { 
        blocked: true, 
        reason: `Too many attempts. Try again in ${Math.ceil(rateLimit.msBeforeNext / 60000)} minutes.`
      };
    }

    // Check for suspicious patterns
    if (this.isSuspiciousPattern(userAgent)) {
      this.suspiciousIPs.add(ip);
      return { blocked: true, reason: 'Suspicious activity detected' };
    }

    return { blocked: false };
  }

  private isSuspiciousPattern(userAgent: string): boolean {
    // Check for common bot patterns
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /curl/i,
      /postman/i,
      /python-requests/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  clearSuspiciousIP(ip: string): void {
    this.suspiciousIPs.delete(ip);
    this.rateLimiter.reset(ip);
  }
}