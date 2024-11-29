import {
  MetadataSchema,
  QuerySchema,
  calculateTotalPages
} from '@/lib/pagination';
import {SubmissionSchema, EndpointParamsSchema} from './schema';
import type {listSubmissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {listSubmissions} from '@/lib/vault';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'List endpoint submissions',
  path: '/{id}',
  request: {
    params: EndpointParamsSchema,
    query: QuerySchema
  },
  responses: {
    200: {
      description: 'List endpoint submission',
      content: {
        'application/json': {
          schema: z.object({
            _metadata: MetadataSchema,
            submissions: SubmissionSchema.array()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListSubmissions = (api: typeof submissionsApi) => {
  return api.openapi(listRoute, async context => {
    const {page, limit} = context.get('pagination');
    const {database} = context.get('services');
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {and, eq}) =>
        and(eq(table.workspaceId, workspace.id), eq(table.id, id))
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    const endpointId = endpoint.id;

    const submissions = await listSubmissions(
      context.env.VAULT_SECRET,
      endpointId
    );
    if (!submissions) {
      throw new HTTPException(404, {
        message: 'Submissions not found'
      });
    }

    const totalItems = submissions.length;
    const totalPages = calculateTotalPages(page, totalItems, limit);

    const response = submissions.map(submission =>
      SubmissionSchema.parse(submission)
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
