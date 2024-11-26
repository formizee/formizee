import {assignOriginDatabase} from '@/lib/databases';
import {SubmissionSchema, PutSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {schema} from '@formizee/db-submissions';
import {createRoute} from '@hono/zod-openapi';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Submissions'],
  summary: 'Update a submission',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PutSchema
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

export const registerPutSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(putRoute, async context => {
    const {database, cache} = context.get('services');
    const input = context.req.valid('json');

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

    // Update submission
    const newSubmissionData: schema.Submission = {
      ...submission,
      isSpam: input.isSpam ?? submission.isSpam,
      isRead: input.isRead ?? submission.isRead
    };

    await Promise.all([
      originDatabase.update(schema.submission).set({
        isSpam: newSubmissionData.isSpam,
        isRead: newSubmissionData.isRead
      }),
      cache.storeSubmission(newSubmissionData)
    ]);

    const response = SubmissionSchema.parse(newSubmissionData);
    return context.json(response, 200);
  });
};
