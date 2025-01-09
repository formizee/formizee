import {SubmissionSchema, EndpointParamsSchema} from './schema';
import {calculatePlanCycleDates, getLimits} from '@formizee/plans';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';

import {
  SubmissionEmail,
  PlanLimitReached,
  PlanLimitWarning
} from '@formizee/email/templates';
import {uploadObject} from '@/lib/storage';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/{endpointId}',
  security: [],
  request: {
    params: EndpointParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: true,
            example: {name: 'example', email: 'example@formizee.com'}
          }
        }
      },
      required: true
    }
  },
  responses: {
    201: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema.omit({data: true})
        }
      }
    },
    302: {
      description: 'Create a submission'
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsApi) => {
  return api.openapi(postRoute, async context => {
    const {endpointId} = context.req.valid('param');
    const location = context.get('location');

    const {
      analytics,
      vault,
      metrics,
      database,
      logger,
      email: emailService
    } = context.get('services');

    const contentType = context.get('bodyContentType');
    const input = context.get('body');

    const queryEndpointStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, endpointId)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryEndpointStart
        });
      });

    if (!endpoint) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/not-found');
      }
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (!endpoint.isEnabled) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/disabled');
      }
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    const queryWorkspaceStart = performance.now();
    const workspace = await database.query.workspace
      .findFirst({
        where: (table, {eq}) => eq(table.id, endpoint.workspaceId)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryWorkspaceStart
        });
      });

    if (!workspace) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/not-found');
      }
      throw new HTTPException(404, {
        message: 'Workspace not found'
      });
    }

    // Check plan limits.

    const limits = getLimits(workspace.plan);
    const billingCycle = calculatePlanCycleDates(workspace);

    const submissionsCount = await analytics.queryFormizeeMonthlySubmissions(
      workspace.id,
      billingCycle.startDate,
      billingCycle.endDate
    );

    // Limit Reached
    if (
      typeof limits.submissions === 'number' &&
      submissionsCount >= limits.submissions
    ) {
      const workspaceMember = await database.query.usersToWorkspaces.findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.workspaceId, workspace.id), eq(table.role, 'owner'))
      });

      if (!workspaceMember) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      const workspaceOwner = await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.id, workspaceMember.userId)
      });

      if (!workspaceOwner) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      if (context.env.ENVIROMENT === 'production') {
        await emailService.emails.send({
          subject: "Action Required: You've reached the limits of your plan",
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee Billing <payments@formizee.com>',
          to: workspaceOwner.email,
          react: (
            <PlanLimitReached
              limit={'submissions'}
              username={workspaceOwner.name}
              currentPlan={workspace.plan}
            />
          )
        });
      }
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/disabled');
      }
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    // 80% Warning
    if (
      typeof limits.submissions === 'number' &&
      submissionsCount >= Math.abs(limits.submissions * 0.8)
    ) {
      const workspaceMember = await database.query.usersToWorkspaces.findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.workspaceId, workspace.id), eq(table.role, 'owner'))
      });

      if (!workspaceMember) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      const workspaceOwner = await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.id, workspaceMember.userId)
      });

      if (!workspaceOwner) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }
        throw new HTTPException(500, {
          message: 'Server Internal Error'
        });
      }

      if (context.env.ENVIROMENT === 'production') {
        await emailService.emails.send({
          subject: "You've reached the 80% monthly usage of your plan",
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee Billing <payments@formizee.com>',
          to: workspaceOwner.email,
          react: (
            <PlanLimitWarning
              limit={'submissions'}
              username={workspaceOwner.name}
              currentPlan={workspace.plan}
            />
          )
        });
      }
    }

    const fileUploads = input.fileUploads.map(entry => {
      return {name: entry.file.name, field: entry.field};
    });

    const {data, error} = await vault.submissions.post({
      endpointId: endpoint.id,
      fileUploads: fileUploads,
      data: input.data,
      location
    });

    if (error) {
      logger.error(`vault.submissions.post(${endpointId})`, {error});
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/error');
      }
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    if (data.pendingUploads.length > 0) {
      let storageUsed = 0;
      await Promise.all(
        data.pendingUploads.map(async pending => {
          if (pending.url === null) {
            return;
          }
          for (const upload of input.fileUploads) {
            if (upload.field === pending.field) {
              storageUsed += upload.file.size;
              await uploadObject(pending.url, upload.file).catch(error => {
                logger.error(
                  `Error uploading pending files on submission ${data.id}`,
                  {error}
                );
              });
            }
          }
        })
      );
      await vault.storage.post({endpointId: endpoint.id, storageUsed});
    }

    if (
      endpoint.emailNotifications &&
      context.env.ENVIROMENT === 'production'
    ) {
      for (const email of endpoint.targetEmails) {
        await emailService.emails.send({
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee <noreply@formizee.com>',
          subject: 'New Form Submission!',
          to: email,
          react: (
            <SubmissionEmail
              workspaceSlug={workspace.slug}
              endpointSlug={endpoint.slug}
              data={input.data}
            />
          )
        });
      }
    }

    metrics.emit({
      metric: 'submission.upload',
      endpointId: endpoint.id,
      workspaceId: workspace.id,
      uploadedAt: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    if (contentType === 'application/json') {
      const response = SubmissionSchema.omit({data: true}).parse(data);
      return context.json(response, 201);
    }

    return context.redirect(endpoint.redirectUrl);
  });
};
