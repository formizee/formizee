import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute} from '@hono/zod-openapi';
import {count, schema, eq} from '@formizee/db';
import {EndpointSchema, PostEndpointSchema} from './schema';
import {newId} from '@formizee/id';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Endpoints'],
  summary: 'Create a endpoint',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostEndpointSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a endpoint',
      content: {
        'application/json': {
          schema: EndpointSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostEndpoint = (api: typeof endpointsAPI) => {
  return api.openapi(postRoute, async context => {
    const {analytics, metrics, database} = context.get('services');
    const workspace = context.get('workspace');
    const input = context.req.valid('json');
    const limits = context.get('limits');
    const rootKey = context.get('key');

    // Check plan limits.
    const queryListStart = performance.now();
    const endpoints = await database
      .select({count: count()})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.workspaceId, workspace.id))
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.list',
          latency: performance.now() - queryListStart
        });
      });

    if (!endpoints[0]) {
      throw new HTTPException(500, {
        message: 'Server Internal Error'
      });
    }

    if (
      typeof limits.endpoints === 'number' &&
      endpoints[0].count >= limits.endpoints
    ) {
      throw new HTTPException(403, {
        message: 'Upgrade for more endpoints'
      });
    }

    // Check slug

    const queryGetStart = performance.now();
    const slugAlreadyTaken = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.slug, input.slug)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryGetStart
        });
      });

    if (slugAlreadyTaken) {
      throw new HTTPException(409, {
        message: 'Slug has to be unique and has already been taken'
      });
    }

    // Check target emails

    const validTargetEmails = input.targetEmails.every(email =>
      workspace.availableEmails.includes(email)
    );
    if (!validTargetEmails) {
      throw new HTTPException(403, {
        message:
          'All the target emails needs to be available in the current workspace'
      });
    }

    const data: schema.InsertEndpoint = {
      id: newId('endpoint'),
      workspaceId: workspace.id,

      slug: input.slug,
      name: input.name ?? input.slug,

      isEnabled: input.isEnabled,
      emailNotifications: input.emailNotifications,

      redirectUrl: input.redirectUrl ?? `${context.env.WEB_URL}/thanks-you`,
      targetEmails: input.targetEmails,

      icon: input.icon,
      color: input.color
    };

    const mutationStart = performance.now();
    await database
      .insert(schema.endpoint)
      .values(data)
      .finally(() => {
        metrics.emit({
          metric: 'main.db.write',
          mutation: 'endpoints.post',
          latency: performance.now() - mutationStart
        });
      });

    await analytics.ingestFormizeeAuditLogs({
      event: 'endpoint.create',
      workspaceId: workspace.id,
      actor: {
        type: 'key',
        id: rootKey.id,
        name: rootKey.name
      },
      resources: [
        {
          id: data.id,
          type: 'endpoint'
        }
      ],
      description: `Created ${data.id}`,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    metrics.emit({
      metric: 'endpoint.created',
      workspaceId: workspace.id,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = EndpointSchema.parse(data);
    return context.json(response, 201);
  });
};
