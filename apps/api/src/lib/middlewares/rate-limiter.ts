import {rateLimiter as honoRateLimiter} from 'hono-rate-limiter';
import type { MiddlewareHandler } from 'hono';

export const rateLimiter = (requestLimitPerMinute = 60): MiddlewareHandler => honoRateLimiter({
  windowMs: 60 * 1000,
  limit: requestLimitPerMinute,
  standardHeaders: 'draft-6',
  keyGenerator: c => c.req.header('x-forwarded-for') ?? ''
});
