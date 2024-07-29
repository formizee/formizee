import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '../hono';

export const pagination = (): MiddlewareHandler<HonoEnv> => {
  return async function middleware(context, next) {
    const page = Number.parseInt(context.req.query('page') || '1', 10);
    const limit = Number.parseInt(context.req.query('limit') || '100', 10);

    context.set('pagination', {page, limit});

    return next();
  };
};
