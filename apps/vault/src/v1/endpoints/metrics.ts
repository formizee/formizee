import {assignOriginDatabase} from '@/lib/databases';
import {openApiErrorResponses} from '@/lib/errors';
import {count, eq, schema} from '@formizee/db/submissions';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import type {endpoints as endpointsAPI} from '.';
import {ParamsSchema} from './schema';

export const metricsRoute = createRoute({
  method: 'get',
  tags: ['Endpoints'],
  summary: 'Get metrics of an endpoint',
  path: '/metrics/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Get metrics of an endpoint',
      content: {
        'application/json': {
          schema: z.object({
            totalSubmissions: z.number()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerMetricsEndpoint = (api: typeof endpointsAPI) => {
  return api.openapi(metricsRoute, async context => {
    const {analytics, database, cache} = context.get('services');
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
    const submissions = await originDatabase
      .select({count: count()})
      .from(schema.submission)
      .where(eq(schema.submission.endpointId, endpoint.id));

    const totalSubmissions = submissions[0]?.count ?? 0;

    analytics.metrics.insertVault({
      type: 'latency',
      query: 'endpoints.metrics',
      latency: performance.now() - mutationStart
    });

    return context.json(
      {
        totalSubmissions
      },
      200
    );
  });
};
