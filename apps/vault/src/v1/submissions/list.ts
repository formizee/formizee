import {MetadataSchema, calculateTotalPages} from '@/lib/pagination';
import {ListSchema, ListSubmissionsResponseSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute, z} from '@hono/zod-openapi';
import {decode} from 'msgpack-lite';

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
            _metadata: MetadataSchema,
            submissions: ListSubmissionsResponseSchema.array()
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
    const offset = (page - 1) * limit;

    // Retrieve all submissions for the endpoint
    const list = await context.env.VAULT.list({prefix: `${input.endpointId}:`});
    const totalPages = calculateTotalPages(page, list.keys.length, limit);
    const keys = list.keys.slice(offset, offset + limit);

    // Fetch submissions in a batch
    const submissions = await Promise.all(
      keys.map(async key => {
        const data = await context.env.VAULT.get(key.name, 'arrayBuffer');
        if (!data) {
          return;
        }

        try {
          const buffer = new Uint8Array(data);
          const submission = decode(buffer);

          const response = {
            id: key.name.split(':')[1],
            data: submission
          };

          return response;
        } catch {
          return;
        }
      })
    );

    const response = submissions.map(submission =>
      ListSubmissionsResponseSchema.parse(submission)
    );

    return context.json(
      {
        _metadata: {
          page,
          totalPages,
          itemsPerPage: limit
        },
        submissions: response
      },
      200
    );
  });
};
