import type {Metric} from '@formizee/metrics';
import type {MiddlewareHandler} from 'hono';
import type {HonoEnv} from '@/lib/hono';

type DiscriminateMetric<T, M = Metric> = M extends {metric: T} ? M : never;

/**
 * workerId and coldStartAt are used to track the lifetime of the worker
 * and are set once when the worker is first initialized.
 *
 * subsequent requests will use the same workerId and coldStartAt
 */
let isolateId: string | null = null;
let coldstartAt: number | null = null;

export function metrics(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    if (!isolateId) {
      isolateId = crypto.randomUUID();
    }
    const services = c.get('services');

    const start = performance.now();

    const m = {
      isolateId,
      metric: 'http.request',
      isolateLifetime: coldstartAt ? Date.now() - coldstartAt : 0,
      path: c.req.path,
      host: new URL(c.req.url).host,
      method: c.req.method,
      // @ts-ignore - this is a bug in the types
      continent: c.req.raw?.cf?.continent,
      // @ts-ignore - this is a bug in the types
      country: c.req.raw?.cf?.country,
      // @ts-ignore - this is a bug in the types
      colo: c.req.raw?.cf?.colo,
      // @ts-ignore - this is a bug in the types
      city: c.req.raw?.cf?.city,
      userAgent: c.req.header('user-agent') ?? '',
      fromAgent: c.req.header('Formizee-Redirect'),
      context: {}
    } as DiscriminateMetric<'http.request'>;
    coldstartAt = Date.now();

    try {
      const telemetry = {
        runtime: c.req.header('Formizee-Telemetry-Runtime'),
        platform: c.req.header('Formizee-Telemetry-Platform'),
        versions: c.req.header('Formizee-Telemetry-SDK')?.split(',')
      };
      if (
        telemetry.runtime &&
        telemetry.platform &&
        telemetry.versions &&
        telemetry.versions.length > 0
      ) {
        const event = {
          runtime: telemetry.runtime || 'unknown',
          platform: telemetry.platform || 'unknown',
          versions: telemetry.versions || [],
          requestId: c.get('requestId'),
          time: Date.now()
        };

        c.executionCtx.waitUntil(
          services.metrics.ingestSdkTelemetry(event).catch(err => {
            console.error('Error ingesting SDK telemetry', {
              method: c.req.method,
              path: c.req.path,
              error: err.message,
              telemetry,
              event
            });
          })
        );
      }

      await next();
    } catch (e) {
      m.error = (e as Error).message;
      console.error('request', {
        method: c.req.method,
        path: c.req.path,
        error: e
      });
      throw e;
    } finally {
      m.status = c.res.status;
      m.serviceLatency = performance.now() - start;
      c.res.headers.append('Formizee-Latency', `service=${m.serviceLatency}ms`);
      c.res.headers.append('Formizee-Version', c.env.VERSION);
      services.metrics.emit(m);
    }
  };
}
