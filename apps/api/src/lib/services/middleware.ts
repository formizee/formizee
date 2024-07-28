import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {env} from '@/lib/enviroment';
import {newId} from '@formizee/id';

import {Analytics} from '@formizee/analytics';
import {KeyService} from '@formizee/keys';
import {EmailService} from '@formizee/email';

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

    const analytics = new Analytics({
      tinybirdToken:
        env.NODE_ENV === 'production' ? env.TINYBIRD_TOKEN : undefined,
      tinybirdUrl: env.TINYBIRD_URL
    });

    const emailService = new EmailService({
      apiKey: env.RESEND_TOKEN
    });

    const keyService = new KeyService();

    c.set('services', {
      analytics,
      keyService,
      emailService
    });

    await next();
  };
}
