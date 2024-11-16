import type {StatusCode} from 'hono/utils/http-status';
import {HTTPException} from 'hono/http-exception';
import {codeToStatus} from '@formizee/error';
import type {MiddlewareHandler} from 'hono';
import {getLimits} from '@formizee/plans';
import type {HonoEnv} from '@/lib/hono';

export const authentication = (): MiddlewareHandler<HonoEnv> => {
  return async function auth(context, next) {
    const {keyService, analytics} = context.get('services');

    const authorization = context.req
      .header('authorization')
      ?.replace('Bearer ', '');

    if (!authorization) {
      throw new HTTPException(401, {
        message: 'API key required'
      });
    }

    const {val, err} = await keyService.verifyKey(authorization);

    if (err || !val) {
      throw new HTTPException(codeToStatus(err.code) as StatusCode, {
        message: err.message
      });
    }

    const limits = getLimits(val.workspace.plan);

    context.set('workspace', val.workspace);
    context.set('key', {id: val.id, name: val.name});
    context.set('limits', limits);

    await analytics.ingestFormizeeMetrics({
      metric: 'api.request',
      workspaceId: val.workspace.id,
      time: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const dailyRequests = await analytics.queryFormizeeDailyRequests(
      val.workspace.id
    );

    if (
      typeof limits.apiDailyRequests === 'number' &&
      dailyRequests >= limits.apiDailyRequests
    ) {
      throw new HTTPException(429, {
        message:
          'API Daily rate limit reached, please try again tomorrow or upgrade to a better plan.'
      });
    }

    await next();
  };
};
