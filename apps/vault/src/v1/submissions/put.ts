import {SubmissionSchema, PutSchema, ParamsSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {schema} from '@formizee/db/submissions';
import {createRoute} from '@hono/zod-openapi';
import {assignOriginDatabase} from '@/lib/databases';
import {aes} from '@formizee/encryption';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Submissions'],
  summary: 'Update a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema,
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
    const {metrics, database, cache, keys} = context.get('services');
    const {endpointId, id} = context.req.valid('param');
    const input = context.req.valid('json');
    const mutationStart = performance.now();

    const originDatabase = await assignOriginDatabase(
      {database, cache},
      endpointId
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message:
          'Origin database not found, please contact support@formizee.com'
      });
    }

    // Query submission
    const submission = await originDatabase.query.submission.findFirst({
      where: (table, {eq}) => eq(table.id, id)
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
      cache.invalidateSubmissions({endpointId}),
      cache.storeSubmission(newSubmissionData)
    ]);

    metrics.emit({
      metric: 'vault.latency',
      query: 'submissions.put',
      latency: performance.now() - mutationStart
    });

    const key = await keys.getEndpointDEK(context.env, endpointId);
    const decryptedSubmission = await aes.decrypt(
      {iv: submission.iv, cipherText: submission.cipherText},
      key
    );

    const response = SubmissionSchema.parse({
      id: submission.id,
      endpointId: submission.endpointId,
      data: JSON.parse(decryptedSubmission),
      isSpam: newSubmissionData.isSpam,
      isRead: newSubmissionData.isRead,
      location: submission.location,
      createdAt: submission.createdAt
    });
    return context.json(response, 200);
  });
};
