import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute} from '@hono/zod-openapi';
import {getSubmission} from '@/lib/helpers';

export const getRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'Retrieve a submission',
  path: '/{endpointId}/{id}',
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

export const registerGetSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(getRoute, async context => {
    const {endpointId, id} = context.req.valid('param');
    const key = `${endpointId}:${id}`;
    const vault = context.env.VAULT;

    const response = await getSubmission(key, vault, true);
    return context.json(response, 200);
  });
};
