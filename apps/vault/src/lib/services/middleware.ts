import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';

import {createConnection} from '@formizee/db-submissions/vault';
import {Analytics} from '@formizee/analytics';
import {Storage} from '@formizee/storage';
import {Cache} from '@/lib/cache';
import {Keys} from '@/lib/keys';

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const analytics = new Analytics({
      tinybirdToken:
        c.env.ENVIROMENT === 'production' ? c.env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: c.env.TINYBIRD_URL
    });

    const database = createConnection({
      databaseUrl: c.env.DATABASE_URL,
      authToken:
        c.env.ENVIROMENT === 'production'
          ? c.env.DATABASE_AUTH_TOKEN
          : undefined
    });

    const storage = new Storage({
      secretAccessKey: c.env.STORAGE_SECRET_ACCESS_KEY,
      accessKeyId: c.env.STORAGE_ACCESS_KEY_ID,
      endpoint: c.env.STORAGE_ENDPOINT,
      bucket: c.env.STORAGE_BUCKET
    });

    const cache = new Cache({client: c.env.cache});
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
