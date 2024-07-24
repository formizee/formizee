import {SubmissionSchema, EndpointParamsSchema} from './schema';
import type {listSubmissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {db} from '@formizee/db';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'List endpoint submissions',
  path: '/{id}',
  request: {
    params: EndpointParamsSchema
  },
  responses: {
    200: {
      description: 'List endpoint submission',
      content: {
        'application/json': {
          schema: SubmissionSchema.array()
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListSubmissions = (api: typeof submissionsApi) => {
  return api.openapi(listRoute, async context => {
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');

    const endpoint = await db.query.endpoint.findFirst({
      where: (table, {and, eq}) =>
        and(eq(table.workspaceId, workspace.id), eq(table.id, id))
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    const submissions = await db.query.submission.findMany({
      where: (table, {eq}) => eq(table.endpointId, endpoint.id)
    });

    if (!submissions) {
      throw new HTTPException(404, {
        message: 'Submissions not found'
      });
    }

    const response = submissions.map(submission =>
      SubmissionSchema.parse(submission)
    );
    return context.json(response, 200);
  });
};
