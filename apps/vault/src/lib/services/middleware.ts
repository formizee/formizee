import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';

import {createConnection} from '@formizee/db/submissions';
import {ConsoleLogger} from '@formizee/logger';
import {Analytics} from '@formizee/analytics';
import {Storage} from '@formizee/storage';
import {newId} from '@formizee/id';
import {Cache} from '@/lib/cache';
import {Keys} from '@/lib/keys';

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
 * Call this once before any hono handlers run.
 */
export function services(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    if (!isolateId) {
      isolateId = crypto.randomUUID();
    }
    if (!isolateCreatedAt) {
      isolateCreatedAt = Date.now();
    }
    c.set('isolateId', isolateId);
    c.set('isolateCreatedAt', isolateCreatedAt);

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

    const logger = new ConsoleLogger({
      requestId,
      ctx: c.executionCtx,
      application: 'vault',
      emitLogs: c.env.EMIT_LOGS,
      environment: c.env.ENVIROMENT,
      logtailToken: c.env.LOGTAIL_TOKEN,
      defaultFields: {environment: c.env.ENVIROMENT}
    });

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
      logger,
      cache,
      keys
    });

    await next();
  };
}
