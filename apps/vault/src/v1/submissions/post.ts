import {type DataSchema, generateSchema, validateData} from '@/lib/schemas';
import {SubmissionSchema, ResponseSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute} from '@hono/zod-openapi';
import {encode} from 'msgpack-lite';
import {HTTPException} from 'hono/http-exception';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SubmissionSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: ResponseSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(postRoute, async context => {
    const input = context.req.valid('json');

    // Get the schema
    const schemaObject = await context.env.BUCKET.get(
      `${input.endpointId}/schema.json`
    );
    let rawSchema = await schemaObject?.text();

    // If the schema does not exists, create a new one
    if (!rawSchema) {
      rawSchema = generateSchema(input.data);
      await context.env.BUCKET.put(
        `${input.endpointId}/schema.json`,
        rawSchema
      );
    }

    // Parse the schema
    let schema: DataSchema;
    try {
      schema = JSON.parse(rawSchema);
    } catch {
      throw new HTTPException(500, {
        message: 'Internal error while parsing the submission schema'
      });
    }

    // Validate the schema with the new submission
    const dataIsCorrect = validateData(input.data, schema);
    if (!dataIsCorrect) {
      throw new HTTPException(403, {
        message:
          'The submission structure does not match with the current data structure of the endpoint'
      });
    }

    // Generate the new submission encoded
    const submission = encode(input.data);
    await context.env.VAULT.put(`${input.endpointId}:${input.id}`, submission);

    // Return submission metadata
    const response = {
      id: input.id,
      endpointId: input.endpointId,
      createdAt: new Date().toString()
    };

    return context.json(response, 201);
  });
};
