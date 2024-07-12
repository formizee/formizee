import type {OpenAPIHono} from '@hono/zod-openapi';
import {secureHeaders} from 'hono/secure-headers';
import {cors} from 'hono/cors';
import {csrf} from 'hono/csrf';
import {rateLimiter} from './rate-limiter';
import {bodyLimit} from './body-limit';
import {timeout} from './timeout';
import {logger} from './logger';

export const security = (router: OpenAPIHono): void => {
  if (!process.env.WEB_URL) {
    throw new Error('WEB_URL enviroment variable is not defined.');
  }

  router.use(secureHeaders());
  router.use(rateLimiter());
  router.use(bodyLimit);
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

export {rateLimiter} from './rate-limiter';
