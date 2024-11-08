import type {HonoEnv} from '@/lib/hono';
import type {MiddlewareHandler} from 'hono';
import {cors as honoCors} from 'hono/cors';

export const cors = (): MiddlewareHandler<HonoEnv> => {
  return async function handler(_context, next) {
    honoCors({
      origin: origin => {
        const allowedOrigins =
          /^(https?:\/\/)?((.*\.)?formizee\.com|localhost:3001)$/;
        return allowedOrigins.test(origin) ? origin : null;
      },
      allowMethods: ['GET', 'POST', 'DELETE'],
      credentials: true
    });
    await next();
  };
};
