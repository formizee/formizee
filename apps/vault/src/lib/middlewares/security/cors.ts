import type {HonoEnv} from '@/lib/hono';
import type {MiddlewareHandler} from 'hono';
import {cors as honoCors} from 'hono/cors';

export const cors = (): MiddlewareHandler<HonoEnv> => {
  return async function handler(_context, next) {
    honoCors({
      origin: ['http://localhost:3001', 'https://formizee.com'],
      allowMethods: ['GET', 'POST', 'DELETE'],
      credentials: true
    });
    await next();
  };
};
