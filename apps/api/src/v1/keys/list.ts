import {
  QuerySchema,
  MetadataSchema,
  calculateTotalPages
} from '@/lib/pagination';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import type {listKeys as keysApi} from '.';
import {KeySchema} from './schema';
import {count, eq, schema} from '@formizee/db';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Keys'],
  summary: 'List keys',
  path: '/',
  request: {
    query: QuerySchema
  },
  responses: {
    200: {
      description: 'List keys',
      content: {
        'application/json': {
          schema: z.object({
            _metadata: MetadataSchema,
            keys: KeySchema.array()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListKeys = (api: typeof keysApi) => {
  return api.openapi(listRoute, async context => {
    const {database, metrics} = context.get('services');
    const {page, limit} = context.get('pagination');
    const workspace = context.get('workspace');

    const queryStart = performance.now();
    const keys = await database.query.key
      .findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspace.id),
        offset: (page - 1) * limit,
        limit
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'keys.list',
          latency: performance.now() - queryStart
        });
      });

    if (!keys) {
      throw new HTTPException(404, {
        message: 'Keys not found'
      });
    }

    async function countTotalItems(): Promise<number> {
      const queryStart = performance.now();
      const data = await database
        .select({totalItems: count()})
        .from(schema.key)
        .where(eq(schema.key.workspaceId, workspace.id))
        .finally(() => {
          metrics.emit({
            metric: 'main.db.read',
            query: 'keys.list',
            latency: performance.now() - queryStart
          });
        });

      if (!data[0]) {
        throw new HTTPException(404, {
          message: 'Keys not found'
        });
      }

      return data[0].totalItems;
    }

    const totalItems = await countTotalItems();
    const totalPages = calculateTotalPages(page, totalItems, limit);

    const response = keys.map(key => KeySchema.parse(key));
    return context.json(
      {
        _metadata: {
          page,
          totalPages,
          itemsPerPage: limit
        },
        keys: response
      },
      200
    );
  });
};
