import {
  SubmissionEmail,
  PlanLimitReached,
  PlanLimitWarning
} from '@formizee/email/templates';
import {SubmissionSchema, EndpointParamsSchema} from './schema';
import {calculatePlanCycleDates} from '@formizee/plans';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {postSubmission} from '@/lib/vault';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/{id}',
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
          schema: SubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsApi) => {
  return api.openapi(postRoute, async context => {
    const {
      analytics,
      metrics,
      database,
      email: emailService
    } = context.get('services');
    const workspacePlan = context.get('workspace').plan;
    const workspaceId = context.get('workspace').id;
    const location = context.get('location');
    const {id} = context.req.valid('param');
    const limits = context.get('limits');

    if (context.req.header('Content-Type') !== 'application/json') {
      throw new HTTPException(400, {
        message: "Use one of the supported body types: 'application/json'"
      });
    }

    // biome-ignore lint/suspicious/noExplicitAny:
    const input = await context.req.json<any>();

    const queryEndpointStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, id)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryEndpointStart
        });
      });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (endpoint.workspaceId !== workspaceId) {
      throw new HTTPException(401, {
        message: 'This submission belongs to another workspace'
      });
    }

    const queryWorkspaceStart = performance.now();
    const workspace = await database.query.workspace
      .findFirst({
        where: (table, {eq}) => eq(table.id, workspaceId)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryWorkspaceStart
        });
      });

    if (!workspace) {
      throw new HTTPException(404, {
        message: 'Workspace not found'
      });
    }

    if (!endpoint.isEnabled) {
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    if (Object.keys(input).length === 0) {
      throw new HTTPException(400, {
        message: 'The submission data is empty'
      });
    }

    // Check plan limits.

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
          and(eq(table.workspaceId, workspaceId), eq(table.role, 'owner'))
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
        await emailService.emails.send({
          subject: "Action Required: You've reached the limits of your plan",
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee Billing <payments@formizee.com>',
          to: workspaceOwner.email,
          react: (
            <PlanLimitReached
              limit={'submissions'}
              username={workspaceOwner.name}
              currentPlan={workspacePlan}
            />
          )
        });
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
          and(eq(table.workspaceId, workspaceId), eq(table.role, 'owner'))
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
        await emailService.emails.send({
          subject: "You've reached the 80% monthly usage of your plan",
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee Billing <payments@formizee.com>',
          to: workspaceOwner.email,
          react: (
            <PlanLimitWarning
              limit={'submissions'}
              username={workspaceOwner.name}
              currentPlan={workspacePlan}
            />
          )
        });
      }
    }

    const newSubmission = await postSubmission(context.env.VAULT_SECRET, {
      endpointId: endpoint.id,
      data: input,
      location
    }).catch(error => {
      throw new HTTPException(error.status, error.body);
    });

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
              data={input}
            />
          )
        });
      }
    }

    metrics.emit({
      metric: 'submission.upload',
      endpointId: endpoint.id,
      workspaceId,
      uploadedAt: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = SubmissionSchema.parse(newSubmission);
    return context.json(response, 201);
  });
};
