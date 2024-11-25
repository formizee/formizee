import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {HTTPException} from 'hono/http-exception';

export const authentication = (): MiddlewareHandler<HonoEnv> => {
  return async function auth(context, next) {
    if (context.env.ENVIROMENT === 'development') {
      return next();
    }

    const apiKey = context.req.header('Authorization')?.replace('Bearer ', '');
    if (apiKey === context.env.VAULT_SECRET) {
      return next();
    }
    throw new HTTPException(401, {
      message: 'API key required'
    });
  };
};
