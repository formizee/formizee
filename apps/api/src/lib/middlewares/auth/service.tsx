import type {StatusCode} from 'hono/utils/http-status';
import {HTTPException} from 'hono/http-exception';
import {codeToStatus} from '@formizee/error';
import type {MiddlewareHandler} from 'hono';
import {getLimits} from '@formizee/plans';
import type {HonoEnv} from '@/lib/hono';
import {PlanLimitWarning} from '@formizee/email/templates';
import {render} from '@formizee/email';

export const authentication = (): MiddlewareHandler<HonoEnv> => {
  return async function auth(context, next) {
    const {apiKeys, analytics, metrics, database, email} =
      context.get('services');

    const authorization = context.req
      .header('authorization')
      ?.replace('Bearer ', '');

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

    const limits = getLimits(val.workspace.plan);

    context.set('workspace', val.workspace);
    context.set('key', {id: val.id, name: val.name});
    context.set('limits', limits);

    const dailyRequests = await analytics.queryFormizeeDailyRequests(
      val.workspace.id
    );

    // Daily limit reached
    if (
      typeof limits.apiDailyRequests === 'number' &&
      dailyRequests >= limits.apiDailyRequests
    ) {
      throw new HTTPException(429, {
        message:
          'API Daily rate limit reached, please try again tomorrow or upgrade to a better plan.'
      });
    }

    metrics.emit({
      metric: 'api.request',
      workspaceId: val.workspace.id,
      time: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    // 80% percent warning
    if (
      typeof limits.apiDailyRequests === 'number' &&
      dailyRequests === Math.abs(limits.apiDailyRequests * 0.8)
    ) {
      const workspaceMember = await database.query.usersToWorkspaces.findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.workspaceId, val.workspace.id), eq(table.role, 'owner'))
      });

      if (!workspaceMember) {
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      const workspaceOwner = await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.id, workspaceMember.userId)
      });

      if (!workspaceOwner) {
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      if (context.env.ENVIROMENT === 'production') {
        await email.emails.send({
          subject: "You've reached the 80% monthly usage of your plan",
          replyTo: 'Formizee Support <support@formizee.com>',
          from: 'Formizee Billing <payments@formizee.com>',
          to: workspaceOwner.email,
          html: await render(
            <PlanLimitWarning
              limit={'apiDailyRequests'}
              username={workspaceOwner.name}
              currentPlan={val.workspace.plan}
            />,
            {pretty: true}
          ),
          plainText: await render(
            <PlanLimitWarning
              limit={'apiDailyRequests'}
              username={workspaceOwner.name}
              currentPlan={val.workspace.plan}
            />,
            {plainText: true}
          )
        });
      }
    }

    await next();
  };
};
