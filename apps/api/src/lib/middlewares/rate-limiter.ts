import type {MiddlewareHandler} from 'hono';
import {rateLimiter as honoRateLimiter} from 'hono-rate-limiter';
import {HTTPException} from 'hono/http-exception';

export const rateLimiter = (requestLimitPerMinute = 60): MiddlewareHandler =>
  honoRateLimiter({
    windowMs: 60 * 1000,
    limit: requestLimitPerMinute,
    standardHeaders: 'draft-6',
    keyGenerator: c => c.req.header('x-forwarded-for') ?? '',
    handler: () => {
      throw new HTTPException(429, {
        message: 'Rate limit reached, please try again later'
      });
    }
  });
