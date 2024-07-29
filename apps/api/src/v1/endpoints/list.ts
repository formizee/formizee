import {
  QuerySchema,
  MetadataSchema,
  calculateTotalPages
} from '@/lib/pagination';
import type {listEndpoints as endpointsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {EndpointSchema} from './schema';
import {count, eq, schema} from '@formizee/db';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Endpoints'],
  summary: 'List endpoints',
  path: '/',
  request: {
    query: QuerySchema
  },
  responses: {
    200: {
      description: 'Retrieve a list of endpoints',
      content: {
        'application/json': {
          schema: z.object({
            _metadata: MetadataSchema,
            endpoints: EndpointSchema.array()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListEndpoints = (api: typeof endpointsAPI) => {
  return api.openapi(listRoute, async context => {
    const {page, limit} = context.get('pagination');
    const {database} = context.get('services');
    const workspace = context.get('workspace');

    const endpoints = await database.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id),
      offset: (page - 1) * limit,
      limit
    });

    if (!endpoints) {
      throw new HTTPException(404, {
        message: 'Endpoints not found'
      });
    }

    async function countTotalItems(): Promise<number> {
      const data = await database
        .select({totalItems: count()})
        .from(schema.endpoint)
        .where(eq(schema.endpoint.workspaceId, workspace.id));

      if (!data[0]) {
        throw new HTTPException(404, {
          message: 'Endpoints not found'
        });
      }

      return data[0].totalItems;
    }

    const totalItems = await countTotalItems();
    const totalPages = calculateTotalPages(page, totalItems, limit);

    const response = endpoints.map(endpoint => EndpointSchema.parse(endpoint));
    return context.json(
      {
        _metadata: {
          page,
          totalPages,
          itemsPerPage: limit
        },
        endpoints: response
      },
      200
    );
  });
};
