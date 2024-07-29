import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {newId} from '@formizee/id';

import {Analytics} from '@formizee/analytics';
import {KeyService} from '@formizee/keys';
import {EmailService} from '@formizee/email';
import {createConnection} from '@formizee/db';

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    // Metrics
    const requestId = newId('request');
    c.set('requestId', requestId);
    c.set('userAgent', c.req.header('User-Agent') ?? '');
    c.res.headers.set('Formizee-Request-Id', requestId);
    c.set(
      'location',
      c.req.header('True-Client-IP') ??
        c.req.header('CF-Connecting-IP') ??
        // @ts-expect-error - the cf object will be there on cloudflare
        c.req.raw?.cf?.colo ??
        ''
    );

    const database = createConnection(c.env.DATABASE_URL);

    const analytics = new Analytics({
      tinybirdToken:
        c.env.ENVIROMENT === 'production' ? c.env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: c.env.TINYBIRD_URL
    });

    const emailService = new EmailService({
      apiKey:
        c.env.ENVIROMENT === 'production' ? c.env.RESEND_TOKEN : 're_123456789'
    });

    const keyService = new KeyService({database});

    c.set('services', {
      database,
      analytics,
      keyService,
      emailService
    });

    await next();
  };
}
