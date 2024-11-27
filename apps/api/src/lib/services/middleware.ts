import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {newId} from '@formizee/id';

import {Resend} from 'resend';
import {Analytics} from '@formizee/analytics';
import {KeyService} from '@formizee/keys';
import {createConnection} from '@formizee/db';

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
        c.env.ENVIROMENT === 'production'
          ? c.env.DATABASE_AUTH_TOKEN
          : undefined
    });

    const email = new Resend(
      c.env.ENVIROMENT === 'production' ? c.env.RESEND_TOKEN : 're_123456789'
    );

    const apiKeys = new KeyService({database});

    c.set('services', {
      analytics,
      database,
      apiKeys,
      email
    });

    await next();
  };
}
