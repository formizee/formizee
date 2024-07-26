import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {env} from '@/lib/enviroment';
import {newId} from '@formizee/id';

import {Analytics} from '@formizee/analytics';
import {KeyService} from '@formizee/keys';

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const requestId = newId('request');
    c.set('requestId', requestId);
    c.res.headers.set('Formizee-Request-Id', requestId);

    const analytics = new Analytics({
      tinybirdToken:
        env.NODE_ENV === 'production' ? env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: env.TINYBIRD_URL
    });

    const keyService = new KeyService();

    c.set('services', {
      keyService,
      analytics
    });

    await next();
  };
}
