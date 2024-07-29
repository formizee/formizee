import type {HonoEnv} from '@/lib/hono';
import type {MiddlewareHandler} from 'hono';
import {cors as honoCors} from 'hono/cors';

export const cors = (): MiddlewareHandler<HonoEnv> => {
  return async function handler(context, next) {
    honoCors({
      origin: context.env.WEB_URL,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    });
    await next();
  };
};
