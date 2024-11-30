import {assignOriginDatabase} from '@/lib/databases';
import {openApiErrorResponses} from '@/lib/errors';
import {eq, schema} from '@formizee/db/submissions';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import type {endpoints as endpointsAPI} from '.';
import {ParamsSchema} from './schema';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Endpoints'],
  summary: 'Delete a endpoint',
  path: '/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a endpoint',
      content: {
        'application/json': {
          schema: z.any({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteEndpoint = (api: typeof endpointsAPI) => {
  return api.openapi(deleteRoute, async context => {
    const {metrics, database, storage, cache} = context.get('services');
    const input = context.req.valid('param');
    const mutationStart = performance.now();

    const originDatabase = await assignOriginDatabase(
      {database, cache},
      input.id
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message:
          'Origin database not found, please contact support@formizee.com'
      });
    }

    // Query endpoint
    const endpoint = await originDatabase.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    // Query submissions
    const submissions = await originDatabase.query.submission.findMany({
      where: (table, {eq}) => eq(table.endpointId, endpoint.id)
    });

    // Delete cache and files
    await Promise.all(
      submissions.map(async submission => {
        await storage.deleteSubmissionData(originDatabase, submission.id);
        await cache.invalidateSubmissions({endpointId: endpoint.id});
        await cache.deleteSubmission(submission.id);
      })
    );

    // Delete endpoint data
    await Promise.all([
      originDatabase
        .delete(schema.endpoint)
        .where(eq(schema.endpoint.id, endpoint.id)),
      originDatabase
        .delete(schema.mappings)
        .where(eq(schema.mappings.endpointId, endpoint.id))
    ]);

    metrics.emit({
      metric: 'vault.latency',
      query: 'endpoints.delete',
      latency: performance.now() - mutationStart
    });

    return context.json({}, 200);
  });
};
