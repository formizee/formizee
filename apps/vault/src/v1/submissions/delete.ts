import {assignOriginDatabase} from '@/lib/databases';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {ParamsSchema} from './schema';
import {eq, schema} from '@formizee/db-submissions';

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
    const {database, storage, cache} = context.get('services');
    const input = context.req.valid('param');

    // Assign the database to handle this endpoint
    const originDatabase = await assignOriginDatabase(
      {database, cache},
      input.endpointId
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message: 'Origin database not found'
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
    await storage.deleteSubmissionData(originDatabase, submission.id);

    // Delete submission and cache
    await Promise.all([
      originDatabase
        .delete(schema.submission)
        .where(eq(schema.submission.id, submission.id)),
      cache.deleteSubmission(submission.id)
    ]);

    return context.json({}, 200);
  });
};