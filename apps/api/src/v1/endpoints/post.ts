import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute} from '@hono/zod-openapi';
import {db, count, schema, eq} from '@formizee/db';
import {EndpointSchema} from './schema';
import {env} from '@/lib/enviroment';
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
          schema: EndpointSchema.omit({id: true, workspaceId: true})
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
    const workspace = context.get('workspace');
    const input = context.req.valid('json');
    const limits = context.get('limits');

    // Check plan limits.
    const endpoints = await db
      .select({count: count()})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.workspaceId, workspace.id));

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

    const slugAlreadyTaken = await db.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.slug, input.slug)
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

      isEnabled: input.isEnabled,
      emailNotifications: input.emailNotifications,

      redirectUrl: input.redirectUrl ?? `${env.WEB_URL}/thanks-you`,
      targetEmails: input.targetEmails,

      icon: input.icon,
      color: input.color
    };

    await db.insert(schema.endpoint).values(data);

    const response = EndpointSchema.parse(data);
    return context.json(response, 201);
  });
};
