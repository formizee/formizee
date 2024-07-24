import type {StatusCode} from 'hono/utils/http-status';
import {HTTPException} from 'hono/http-exception';
import {codeToStatus} from '@formizee/error';
import type {MiddlewareHandler} from 'hono';
import {getLimits} from '@formizee/plans';
import type {HonoEnv} from '@/lib/hono';

export const authentication = (): MiddlewareHandler<HonoEnv> => {
  return async function auth(context, next) {
    const {keyService} = context.get('services');
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

    context.set('workspace', val.workspace);
    context.set('limits', getLimits(val.workspace.plan));

    await next();
  };
};
