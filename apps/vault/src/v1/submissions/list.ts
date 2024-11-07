import {getSchema, getSubmission, type DataSchema} from '@/lib/helpers';
import {MetadataSchema, calculateTotalPages} from '@/lib/pagination';
import {ListSchema, SubmissionSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';

export const listRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'List all submissions',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ListSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'List all submissions',
      content: {
        'application/json': {
          schema: z.object({
            _metadata: MetadataSchema.merge(
              z.object({
                schema: z.custom<DataSchema>()
              })
            ),
            submissions: SubmissionSchema.array()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListSubmissions = (api: typeof submissionsAPI) => {
  return api.openapi(listRoute, async context => {
    const {page, limit} = context.get('pagination');
    const input = context.req.valid('json');
    const bucket = context.env.BUCKET;
    const vault = context.env.VAULT;

    // List all submissions for the endpoint.
    const list = await vault.list({prefix: `${input.endpointId}:`});

    if (list.keys.length < 1) {
      return context.json(
        {
          _metadata: {
            schema: {},
            page: 1,
            totalPages: 1,
            itemsPerPage: 0
          },
          submissions: []
        },
        200
      );
    }

    // Get the endpoint schema from the bucket
    const schema = await getSchema(input.endpointId, bucket);

    if (!schema) {
      throw new HTTPException(404, {
        message: 'Endpoint schema not found'
      });
    }

    // Calculate pagination values.
    const totalPages = calculateTotalPages(page, list.keys.length, limit);
    const offset = (page - 1) * limit;

    // Retrieve the current keys of the submissions.
    const keys = list.keys.slice(offset, offset + limit);

    // Fetch submissions in a batch.
    const data = await Promise.all(
      keys.map(async key => {
        return await getSubmission(key.name, vault);
      })
    );

    // Parse submissions data.
    const submissions = data.map(submission =>
      SubmissionSchema.parse(submission)
    );

    return context.json(
      {
        _metadata: {
          schema: schema,
          page,
          totalPages,
          itemsPerPage: limit
        },
        submissions
      },
      200
    );
  });
};
