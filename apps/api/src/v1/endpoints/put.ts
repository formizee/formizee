import {EndpointSchema, ParamsSchema} from './schema';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute} from '@hono/zod-openapi';
import {eq, schema} from '@formizee/db';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Endpoints'],
  summary: 'Update a endpoint',
  path: '/{id}',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: EndpointSchema.omit({id: true, workspaceId: true}).partial()
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update a endpoint',
      content: {
        'application/json': {
          schema: EndpointSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPutEndpoint = (api: typeof endpointsAPI) => {
  return api.openapi(putRoute, async context => {
    const {analytics, database} = context.get('services');
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');
    const input = context.req.valid('json');
    const rootKey = context.get('key');

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {and, eq}) =>
        and(eq(table.workspaceId, workspace.id), eq(table.id, id))
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (input.slug && endpoint.slug !== input.slug) {
      const slugAlreadyTaken = await database.query.endpoint.findFirst({
        where: eq(schema.endpoint.slug, input.slug)
      });

      if (slugAlreadyTaken) {
        throw new HTTPException(409, {
          message: 'Slug has to be unique and has already been taken'
        });
      }
    }

    if (input.targetEmails && endpoint.targetEmails !== input.targetEmails) {
      const validTargetEmails = input.targetEmails.every(email =>
        workspace.availableEmails.includes(email)
      );
      if (!validTargetEmails) {
        throw new HTTPException(403, {
          message:
            'All the target emails needs to be available in the current workspace'
        });
      }
    }

    if (Object.keys(input).length === 0) {
      throw new HTTPException(400, {
        message: "There's no fields to update"
      });
    }

    const newEndpoint = await database
      .update(schema.endpoint)
      .set(input)
      .where(eq(schema.endpoint.id, id))
      .returning();

    await analytics.ingestFormizeeAuditLogs({
      event: 'endpoint.update',
      workspaceId: workspace.id,
      actor: {
        type: 'key',
        id: rootKey.id,
        name: rootKey.name
      },
      resources: [
        {
          id: endpoint.id,
          type: 'endpoint'
        }
      ],
      description: `Updated ${endpoint.id}`,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = EndpointSchema.parse(newEndpoint[0]);
    return context.json(response, 200);
  });
};
