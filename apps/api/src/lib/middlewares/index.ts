import type {OpenAPIHono} from '@hono/zod-openapi';
import {secureHeaders} from 'hono/secure-headers';
import {rateLimiter} from 'hono-rate-limiter';
import {csrf} from 'hono/csrf';
import {bodyLimit} from './body-limit';
import {timeout} from './timeout';
import {logger} from './logger';

export const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-6',
  keyGenerator: c => c.req.header('x-forwarded-for') ?? ''
});

export const security = (router: OpenAPIHono): void => {
  router.use(secureHeaders());
  router.use(bodyLimit);
  router.use(limiter);
  router.use(timeout);
  router.use(logger);
  router.use(csrf());
};
