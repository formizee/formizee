import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';

import {Analytics} from '@formizee/analytics';

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const analytics = new Analytics({
      tinybirdToken:
        c.env.ENVIROMENT === 'production' ? c.env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: c.env.TINYBIRD_URL
    });

    c.set('services', {
      analytics
    });

    await next();
  };
}
