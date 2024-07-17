import type {OpenAPIHono} from '@hono/zod-openapi';
import {cors} from 'hono/cors';
import {prettyJSON} from 'hono/pretty-json';
import {secureHeaders} from 'hono/secure-headers';
import {trimTrailingSlash} from 'hono/trailing-slash';
import {bodyLimit} from './body-limit';
import {logger} from './logger';
import {rateLimiter} from './rate-limiter';
import {timeout} from './timeout';

export const security = (router: OpenAPIHono): void => {
  if (!process.env.WEB_URL) {
    throw new Error('WEB_URL enviroment variable is not defined.');
  }

  userExperience(router);
  router.use(secureHeaders());
  router.use(rateLimiter());
  router.use(bodyLimit);
  router.use(timeout);
  router.use(logger);
  router.use(
    cors({
      origin: process.env.WEB_URL,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    })
  );
};

export const userExperience = (router: OpenAPIHono): void => {
  router.use(prettyJSON());
  router.use(trimTrailingSlash());
};

export {rateLimiter} from './rate-limiter';
