import {InsertKeySchema, KeySchema} from './schema';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {count, schema, eq} from '@formizee/db';
import {createRoute} from '@hono/zod-openapi';
import type {keys as keysAPI} from '.';
import {newId} from '@formizee/id';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Keys'],
  summary: 'Create a API key',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: InsertKeySchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a key',
      content: {
        'application/json': {
          schema: KeySchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostKey = (api: typeof keysAPI) => {
  return api.openapi(postRoute, async context => {
    const {analytics, database, metrics, apiKeys} = context.get('services');
    const workspace = context.get('workspace');
    const input = context.req.valid('json');
    const limits = context.get('limits');
    const rootKey = context.get('key');

    // Check plan limits.
    const queryStart = performance.now();
    const keys = await database
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id))
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'keys.list',
          latency: performance.now() - queryStart
        });
      });

    if (!keys[0]) {
      throw new HTTPException(500, {
        message: 'Server Internal Error.'
      });
    }

    if (typeof limits.keys === 'number' && keys[0].count >= limits.keys) {
      throw new HTTPException(403, {
        message: 'Upgrade for more API keys.'
      });
    }

    const {val, err} = await apiKeys.createKey(input.expiresAt);

    if (err || !val) {
      throw new HTTPException(500, {
        message: err.message
      });
    }

    const data: schema.InsertKey = {
      id: newId('key'),
      hash: val.hash,
      name: input.name,
      expiresAt: val.expiresAt,
      workspaceId: workspace.id
    };

    const mutationStart = performance.now();
    await database
      .insert(schema.key)
      .values(data)
      .finally(() => {
        metrics.emit({
          metric: 'main.db.write',
          mutation: 'keys.post',
          latency: performance.now() - mutationStart
        });
      });

    await analytics.ingestFormizeeAuditLogs({
      event: 'key.create',
      workspaceId: workspace.id,
      actor: {
        type: 'key',
        id: rootKey.id,
        name: rootKey.name
      },
      resources: [
        {
          id: data.id,
          type: 'key'
        }
      ],
      description: `Created ${data.id}`,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = KeySchema.parse(data);
    return context.json(response, 201);
  });
};
