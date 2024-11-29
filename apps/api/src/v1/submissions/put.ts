import {getSubmission, putSubmission} from '@/lib/vault';
import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Submissions'],
  summary: 'Update a submission',
  path: '/{id}',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: SubmissionSchema.pick({isRead: true, isSpam: true}).partial()
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPutSubmission = (api: typeof submissionsApi) => {
  return api.openapi(putRoute, async context => {
    const workspaceId = context.get('workspace').id;
    const {database} = context.get('services');
    const {id} = context.req.valid('param');
    const input = context.req.valid('json');

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

    const newSubmission = await putSubmission(
      context.env.VAULT_SECRET,
      id,
      input
    );

    const response = SubmissionSchema.parse(newSubmission);
    return context.json(response, 200);
  });
};
