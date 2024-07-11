import type {OpenAPIHono} from '@hono/zod-openapi';
import {secureHeaders} from 'hono/secure-headers';
import {rateLimiter} from 'hono-rate-limiter';
import {cors} from 'hono/cors';
import {csrf} from 'hono/csrf';
import {bodyLimit} from './body-limit';
import {timeout} from './timeout';
import {logger} from './logger';

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-6',
  keyGenerator: c => c.req.header('x-forwarded-for') ?? ''
});

export const security = (router: OpenAPIHono): void => {
  if (!process.env.WEB_URL)
    throw new Error('WEB_URL enviroment variable is not defined.');

  router.use(secureHeaders());
  router.use(bodyLimit);
  router.use(limiter);
  router.use(timeout);
  router.use(logger);
  router.use(csrf());
  router.use(
    cors({
      origin: process.env.WEB_URL,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    })
  );
};
