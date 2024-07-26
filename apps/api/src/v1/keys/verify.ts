import type {StatusCode} from 'hono/utils/http-status';
import {KeySchema, VerifyKeySchema} from './schema';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {codeToStatus} from '@formizee/error';
import {createRoute} from '@hono/zod-openapi';
import type {keys as keysApi} from '.';

export const verifyRoute = createRoute({
  method: 'post',
  tags: ['Keys'],
  summary: 'Verify a key',
  path: '/verify',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyKeySchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Key verified',
      content: {
        'application/json': {
          schema: KeySchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerVerifyKey = (api: typeof keysApi) => {
  return api.openapi(verifyRoute, async context => {
    const {keyService, analytics} = context.get('services');
    const workspaceId = context.get('workspace').id;
    const {key} = context.req.valid('json');
    const rootKey = context.get('key');

    const {val, err} = await keyService.verifyKey(key);

    if (err || !val) {
      throw new HTTPException(codeToStatus(err.code) as StatusCode, {
        message: err.message
      });
    }

    await analytics.ingestFormizeeAuditLogs({
      event: 'key.verify',
      workspaceId,
      actor: {
        type: 'key',
        id: rootKey.id,
        name: rootKey.name
      },
      resources: [
        {
          id: val.id,
          type: 'key'
        }
      ],
      description: `Verified ${val.id}`,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    const response = KeySchema.parse({
      id: val.id,
      name: val.name,
      expiresAt: val.expiresAt,
      lastAccess: val.lastAccess,
      workspaceId: val.workspace.id
    });
    return context.json(response, 200);
  });
};
