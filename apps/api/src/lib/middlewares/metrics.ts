import type {StatusCode} from 'hono/utils/http-status';
import type {Context, MiddlewareHandler} from 'hono';
import {HTTPException} from 'hono/http-exception';
import {codeToStatus} from '@formizee/error';
import type {HonoEnv} from '@/lib/hono';

export function metrics(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const services = c.get('services');

    let requestBody = await c.req.raw.clone().text();
    requestBody = requestBody.replaceAll(
      /"key":\s*"[a-zA-Z0-9_]+"/g,
      '"key": "<REDACTED>"'
    );
    requestBody = requestBody.replaceAll(
      /"plaintext":\s*"[a-zA-Z0-9_]+"/g,
      '"plaintext": "<REDACTED>"'
    );

    const start = performance.now();
    let serviceLatency = 0;
    let error = '';

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
          services.analytics.telemetry
            .insert({
              ...event,
              request_id: event.requestId
            })
            .catch(err => {
              services.logger.error('Error inserting SDK telemetry', {
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
      error = (e as Error).message;
      c.get('services').logger.error('request', {
        method: c.req.method,
        path: c.req.path,
        error: e
      });
      throw e;
    } finally {
      serviceLatency = performance.now() - start;
      c.res.headers.append('Formizee-Latency', `service=${serviceLatency}ms`);
      c.res.headers.append('Formizee-Version', c.env.VERSION);

      const responseHeaders: Array<string> = [];
      c.res.headers.forEach((v, k) => {
        responseHeaders.push(`${k}: ${v}`);
      });

      let responseBody = await c.res.clone().text();
      responseBody = responseBody.replaceAll(
        /"key":\s*"[a-zA-Z0-9_]+"/g,
        '"key": "<REDACTED>"'
      );
      responseBody = responseBody.replaceAll(
        /"plaintext":\s*"[a-zA-Z0-9_]+"/g,
        '"plaintext": "<REDACTED>"'
      );

      const url = new URL(c.req.url);
      c.executionCtx.waitUntil(
        services.analytics.api.insert({
          request_id: c.get('requestId'),
          time: c.get('requestStartedAt'),
          workspace_id: await getWorkspaceId(c),
          host: url.host,
          method: c.req.method,
          path: `${url.pathname}${
            url.searchParams.size > 0 ? '?' : ''
          }${url.searchParams.toString()}`,
          request_headers: Object.entries(c.req.header()).map(([k, v]) => {
            if (k.toLowerCase() === 'authorization') {
              return `${k}: <REDACTED>`;
            }
            return `${k}: ${v}`;
          }),
          request_body: requestBody,
          response_status: c.res.status,
          response_headers: responseHeaders,
          response_body: responseBody,
          error,
          service_latency: Date.now() - c.get('requestStartedAt'),
          ip_address:
            c.req.header('True-Client-IP') ??
            c.req.header('CF-Connecting-IP') ??
            '',
          user_agent: c.req.header('User-Agent') ?? '',
          // @ts-ignore - this is a bug in the types
          continent: c.req.raw?.cf?.continent,
          // @ts-ignore - this is a bug in the types
          country: c.req.raw?.cf?.country,
          // @ts-ignore - this is a bug in the types
          colo: c.req.raw?.cf?.colo,
          // @ts-ignore - this is a bug in the types
          city: c.req.raw?.cf?.city
        })
      );
    }
  };
}

async function getWorkspaceId(c: Context<HonoEnv>) {
  const {apiKeys} = c.get('services');

  const authorization = c.req.header('authorization')?.replace('Bearer ', '');

  if (!authorization) {
    throw new HTTPException(401, {
      message: 'API key required'
    });
  }

  const {val, err} = await apiKeys.verifyKey(authorization);

  if (err || !val) {
    throw new HTTPException(codeToStatus(err.code) as StatusCode, {
      message: err.message
    });
  }

  return val.id ?? '';
}
