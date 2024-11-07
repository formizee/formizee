import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {decode} from 'msgpack-lite';

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

    // Retrieve the data from the vault
    const data = await context.env.VAULT.get(
      `${endpointId}:${id}`,
      'arrayBuffer'
    );
    if (!data) {
      throw new HTTPException(404, {
        message: 'Submission not found'
      });
    }

    // Decode the data
    try {
      const buffer = new Uint8Array(data);
      const submission = decode(buffer);

      const response = {
        id,
        endpointId,
        data: submission
      };

      return context.json(response, 200);
    } catch {
      throw new HTTPException(500, {
        message: 'There was a problem decoding the submission'
      });
    }
  });
};
