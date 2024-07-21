import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute} from '@hono/zod-openapi';
import {db} from '@formizee/db';
import {EndpointSchema} from './schema';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Endpoints'],
  summary: 'List endpoints',
  path: '/',
  responses: {
    200: {
      description: 'Retrieve a list of endpoints',
      content: {
        'application/json': {
          schema: EndpointSchema.array()
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListEndpoints = (api: typeof endpointsAPI) => {
  return api.openapi(listRoute, async context => {
    const workspace = context.get('workspace');

    const endpoints = await db.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    if (!endpoints) {
      throw new HTTPException(404, {
        message: 'Endpoints not found.'
      });
    }

    const response = endpoints.map(endpoint => EndpointSchema.parse(endpoint));
    return context.json(response, 200);
  });
};
