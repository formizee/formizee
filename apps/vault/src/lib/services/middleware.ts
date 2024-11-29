import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';

import {createConnection} from '@formizee/db/submissions';
import {Analytics} from '@formizee/analytics';
import {Storage} from '@formizee/storage';
import {Cache} from '@/lib/cache';
import {Keys} from '@/lib/keys';
import {newId} from '@formizee/id';

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    // Metrics
    const requestId = newId('request');
    c.set('requestId', requestId);
    c.set('userAgent', c.req.header('User-Agent') ?? '');
    c.res.headers.set('formizee-request-id', requestId);
    c.set(
      'location',
      c.req.header('x-real-ip') ??
        c.req.header('cf-connecting-ip') ??
        String(c.req.raw?.cf?.city) ??
        String(c.req.raw?.cf?.country) ??
        ''
    );
    const analytics = new Analytics({
      tinybirdToken:
        c.env.ENVIROMENT === 'production' ? c.env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: c.env.TINYBIRD_URL
    });

    const database = createConnection({
      databaseUrl: c.env.DATABASE_URL,
      authToken:
        c.env.ENVIROMENT === 'development'
          ? undefined
          : c.env.DATABASE_AUTH_TOKEN
    });

    const storage = new Storage({
      secretAccessKey: c.env.STORAGE_SECRET_ACCESS_KEY,
      accessKeyId: c.env.STORAGE_ACCESS_KEY_ID,
      endpoint: c.env.STORAGE_ENDPOINT,
      bucket: c.env.STORAGE_BUCKET
    });

    const cache = new Cache({client: c.env.cache, analytics});
    const keys = new Keys({client: c.env.keys});

    c.set('services', {
      analytics,
      database,
      storage,
      cache,
      keys
    });

    await next();
  };
}
