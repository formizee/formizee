import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';
import {newId} from '@formizee/id';

import {EmailClient} from '@formizee/email/client';
import {ConsoleLogger} from '@formizee/logger';
import {Analytics} from '@formizee/analytics';
import {createConnection} from '@formizee/db';
import {KeyService} from '@formizee/keys';
import {Vault} from '@formizee/vault';

/**
 * workerId and coldStartAt are used to track the lifetime of the worker
 * and are set once when the worker is first initialized.
 *
 * subsequent requests will use the same workerId and coldStartAt
 */
let isolateId: string | undefined = undefined;
let isolateCreatedAt: number | undefined = undefined;
/**
 * Initialize all services.
 *
 * Call this once before any hono handlers run
 **/

export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    // Metrics
    if (!isolateId) {
      isolateId = crypto.randomUUID();
    }
    if (!isolateCreatedAt) {
      isolateCreatedAt = Date.now();
    }
    c.set('isolateId', isolateId);
    c.set('isolateCreatedAt', isolateCreatedAt);

    const requestId = newId('request');
    c.set('requestId', requestId);

    c.set('userAgent', c.req.header('User-Agent') ?? '');
    c.set('requestStartedAt', Date.now());
    c.res.headers.set('formizee-request-id', requestId);
    c.set(
      'location',
      c.req.header('x-real-ip') ??
        c.req.header('cf-connecting-ip') ??
        String(c.req.raw?.cf?.city) ??
        String(c.req.raw?.cf?.country) ??
        ''
    );

    const logger = new ConsoleLogger({
      requestId,
      application: 'api',
      ctx: c.executionCtx,
      emitLogs: c.env.EMIT_LOGS,
      environment: c.env.ENVIROMENT,
      logtailToken: c.env.LOGTAIL_TOKEN,
      defaultFields: {environment: c.env.ENVIROMENT}
    });

    const analytics = new Analytics({
      url: c.env.ENVIROMENT === 'production' ? c.env.CLICKHOUSE_URL : undefined
    });

    const database = createConnection({
      databaseUrl: c.env.DATABASE_URL,
      authToken:
        c.env.ENVIROMENT === 'development'
          ? undefined
          : c.env.DATABASE_AUTH_TOKEN
    });

    const vault = new Vault({
      url: c.env.VAULT_URL,
      token: c.env.VAULT_SECRET,
      serviceBinding:
        c.env.ENVIROMENT === 'development' ? undefined : c.env.vault
    });

    const email = new EmailClient({
      accessKey: c.env.AWS_SES_ACCESS_KEY,
      secretAccesKey: c.env.AWS_SES_SECRET_ACCESS_KEY
    });

    const apiKeys = new KeyService({
      database,
      analytics,
      cache: c.env.cache
    });

    c.set('services', {
      analytics,
      database,
      apiKeys,
      logger,
      vault,
      email
    });

    await next();
  };
}
