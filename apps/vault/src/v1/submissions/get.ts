import {ParamsSchema, SubmissionSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {assignOriginDatabase} from '@/lib/databases';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {aes} from '@formizee/encryption';

export const getRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'Get a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Get a submission',
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
    const {analytics, logger, database, storage, cache, keys} =
      context.get('services');
    const input = context.req.valid('param');
    const queryStart = performance.now();

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
    let submission = await cache.getSubmission(input.id);
    if (!submission) {
      const data = await originDatabase.query.submission.findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      });
      if (!data) {
        throw new HTTPException(404, {
          message: 'Submission not found'
        });
      }

      submission = data;
    }

    // Decrypt submission
    const key = await keys.getEndpointDEK(context.env, input.endpointId);

    const decryptedSubmission = await aes.decrypt(
      {iv: submission.iv, cipherText: submission.cipherText},
      key
    );

    // Check for file uploads
    const fileUploads = await storage.getDownloadLinks(
      originDatabase,
      submission.id
    );

    try {
      const submissionData = JSON.parse(decryptedSubmission);

      // Merge file uploads with the data
      const data = (fileUploads || []).reduce(
        (acc, file) => {
          if (file && Object.keys(file).length > 0) {
            for (const [key, value] of Object.entries(file)) {
              acc[key] = value;
            }
          }
          return acc;
        },
        {...submissionData}
      );

      const response = {
        id: submission.id,
        endpointId: submission.endpointId,
        data,
        isSpam: submission.isSpam,
        isRead: submission.isRead,
        location: submission.location,
        createdAt: submission.createdAt
      };

      analytics.ingestFormizeeMetrics({
        metric: 'vault.latency',
        query: 'submissions.get',
        latency: performance.now() - queryStart
      });

      return context.json(response, 200);
    } catch (error) {
      logger.error(String(error));
      throw new HTTPException(500, {
        message:
          'Unexpected error parsing the submssion data, please contact with support@formizee.com'
      });
    }
  });
};
