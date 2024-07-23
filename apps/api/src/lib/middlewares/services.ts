import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {KeyService} from '@/services';
/**
 * Initialize all services.
 *
 * Call this once before any hono handlers run.
 */
export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const keyService = new KeyService();

    c.set('services', {
      keyService
    });

    await next();
  };
}
