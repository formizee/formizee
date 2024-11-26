import {ParamsSchema, SubmissionSchema} from './schema';
import {assignOriginDatabase} from '@/lib/databases';
import type {submissions as submissionsAPI} from '.';
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
    const {database, storage, cache, keys} = context.get('services');
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

      // Ensure that fileUploads is not undefined and merge it
      const data = (fileUploads || []).reduce(
        (acc, fileObj) => {
          // Ensure that fileObj is a valid object and not empty
          if (fileObj && Object.keys(fileObj).length > 0) {
            // Iterate over the entries of fileObj
            for (const [key, value] of Object.entries(fileObj)) {
              acc[key] = value; // Add the key-value pair to the accumulator
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

      return context.json(response, 200);
    } catch (error) {
      console.error(error);
      throw new HTTPException(500, {
        message:
          'Unexpected error parsing the submssion data, please contact with support@formizee.com'
      });
    }
  });
};
