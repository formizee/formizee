import {getSchema, generateSchema, validateData} from '@/lib/helpers';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute, z} from '@hono/zod-openapi';
import {PostSchema} from './schema';
import {HTTPException} from 'hono/http-exception';
import {encode} from 'msgpack-lite';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(postRoute, async context => {
    const {id, data, endpointId} = context.req.valid('json');
    const key = `${endpointId}:${id}`;
    const bucket = context.env.BUCKET;
    const vault = context.env.VAULT;

    let schema = await getSchema(endpointId, bucket);

    if (!schema) {
      schema = await generateSchema(endpointId, data, bucket);
    }

    const submissionValid = validateData(data, schema);

    if (!submissionValid) {
      throw new HTTPException(403, {
        message:
          'The submission structure does not match with the current data structure of the endpoint'
      });
    }

    const submission = encode(data);
    await vault.put(key, submission);

    return context.json({}, 201);
  });
};
