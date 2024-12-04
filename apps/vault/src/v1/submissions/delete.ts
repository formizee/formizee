import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {eq, schema} from '@formizee/db/submissions';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {ParamsSchema} from './schema';
import {assignOriginDatabase} from '@/lib/databases';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Submissions'],
  summary: 'Delete a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a submission',
      content: {
        'application/json': {
          schema: z.any({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(deleteRoute, async context => {
    const {metrics, database, storage, cache} = context.get('services');
    const input = context.req.valid('param');
    const mutationStart = performance.now();

    const originDatabase = await assignOriginDatabase(
      {database, cache},
      input.endpointId
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message:
          'Origin database not found, please contact support@formizee.com'
      });
    }

    // Query submission
    const submission = await originDatabase.query.submission.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!submission) {
      throw new HTTPException(404, {
        message: 'Submission not found'
      });
    }

    // Delete file uploads
    const {freeSpace} = await storage.deleteSubmissionData(
      originDatabase,
      submission.id
    );

    const endpoint = await originDatabase
      .select({storageUsed: schema.endpoint.storageUsed})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.id, input.endpointId))
      .get();
    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    // Delete submission and cache
    await Promise.all([
      originDatabase
        .delete(schema.submission)
        .where(eq(schema.submission.id, submission.id)),
      originDatabase
        .update(schema.endpoint)
        .set({storageUsed: endpoint.storageUsed - freeSpace})
        .where(eq(schema.endpoint.id, input.endpointId)),
      cache.deleteSubmission(submission.id),
      cache.invalidateSubmissions(input)
    ]);

    metrics.emit({
      metric: 'vault.latency',
      query: 'submissions.delete',
      latency: performance.now() - mutationStart
    });

    return context.json({}, 200);
  });
};
