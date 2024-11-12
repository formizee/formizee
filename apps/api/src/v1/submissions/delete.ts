import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {eq, schema} from '@formizee/db';
import {ParamsSchema} from './schema';
import {deleteSubmission} from '@/lib/vault';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Submissions'],
  summary: 'Delete a submission',
  path: '/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a submission',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteSubmission = (api: typeof submissionsApi) => {
  return api.openapi(deleteRoute, async context => {
    const workspaceId = context.get('workspace').id;
    const {database} = context.get('services');
    const {id} = context.req.valid('param');

    const submission = await database.query.submission.findFirst({
      where: (table, {eq}) => eq(table.id, id)
    });

    if (!submission) {
      throw new HTTPException(404, {
        message: 'Submission not found'
      });
    }

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, submission.endpointId)
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (endpoint.workspaceId !== workspaceId) {
      throw new HTTPException(401, {
        message: 'This submission belongs to another workspace'
      });
    }

    await database
      .delete(schema.submission)
      .where(eq(schema.submission.id, submission.id));

    await deleteSubmission(
      context.env.VAULT_SECRET,
      endpoint.id,
      submission.id
    );

    return context.json({}, 200);
  });
};
