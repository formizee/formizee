import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {getSubmission} from '@/lib/vault';

export const getRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'Retrieve a submission',
  path: '/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Retrieve a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerGetSubmission = (api: typeof submissionsApi) => {
  return api.openapi(getRoute, async context => {
    const workspaceId = context.get('workspace').id;
    const {database} = context.get('services');
    const {id} = context.req.valid('param');

    const submission = await getSubmission(context.env.VAULT_SECRET, id);
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

    const response = SubmissionSchema.parse(submission);

    return context.json(response, 200);
  });
};
