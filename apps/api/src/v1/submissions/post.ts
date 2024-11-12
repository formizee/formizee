import {SubmissionSchema, EndpointParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {eq, count, schema} from '@formizee/db';
import {newId} from '@formizee/id';
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
    const {analytics, database, emailService} = context.get('services');
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
    //
    // biome-ignore lint/suspicious/noExplicitAny:
    const input = await context.req.json<any>();

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, id)
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

    // Check plan limits.
    const submissions = await database
      .select({count: count()})
      .from(schema.submission)
      .innerJoin(
        schema.endpoint,
        eq(schema.submission.endpointId, schema.endpoint.id)
      )
      .innerJoin(
        schema.workspace,
        eq(schema.endpoint.workspaceId, schema.workspace.id)
      )
      .where(eq(schema.workspace.id, workspaceId));

    if (!submissions[0]) {
      throw new HTTPException(500, {
        message: 'Server Internal Error'
      });
    }

    // Limit Reached
    if (
      typeof limits.submissions === 'number' &&
      submissions[0].count >= limits.submissions
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
        await emailService.sendPlanLimitReachedEmail({
          email: workspaceOwner.email,
          username: workspaceOwner.name,
          limitReached: 'submissions',
          currentPlan: workspacePlan
        });
      }
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    // 80% Warning
    if (
      typeof limits.submissions === 'number' &&
      submissions[0].count >= Math.abs(limits.submissions * 0.8)
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
        await emailService.sendPlanLimitWarningEmail({
          email: workspaceOwner.email,
          username: workspaceOwner.name,
          limitReached: 'submissions',
          currentPlan: workspacePlan
        });
      }
    }

    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, workspaceId)
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

    const data: schema.InsertSubmission = {
      id: newId('submission'),
      endpointId: endpoint.id,
      data: {},
      location
    };

    const newSubmission = await database
      .insert(schema.submission)
      .values(data)
      .returning();

    await postSubmission(context.env.VAULT, context.env.VAULT_SECRET, {
      endpointId: data.endpointId,
      id: data.id,
      data: input
    });

    if (
      endpoint.emailNotifications &&
      context.env.ENVIROMENT === 'production'
    ) {
      for (const email of endpoint.targetEmails) {
        await emailService.sendSubmissionEmail({
          email,
          data: input,
          endpointSlug: endpoint.slug,
          workspaceSlug: workspace.slug
        });
      }
    }

    await analytics.ingestFormizeeMetrics({
      metric: 'submission.upload',
      endpointId: endpoint.id,
      workspaceId,
      uploadedAt: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = SubmissionSchema.parse(newSubmission[0]);
    return context.json(response, 201);
  });
};
