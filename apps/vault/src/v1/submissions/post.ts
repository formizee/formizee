import {PostResponseSchema, PostSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {validateSubmission} from '@/lib/schemas';
import {schema} from '@formizee/db/submissions';
import {createRoute} from '@hono/zod-openapi';
import {aes} from '@formizee/encryption';
import {newId} from '@formizee/id';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: PostResponseSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(postRoute, async context => {
    const {database, cache, storage, keys} = context.get('services');
    const input = context.req.valid('json');

    // Schema validation
    const submissionIsValid = await validateSubmission(database, input);

    if (!submissionIsValid) {
      throw new HTTPException(403, {
        message: 'The submision does not match the current endpoint schema'
      });
    }

    // Encrypt submission
    const key = await keys.getEndpointDEK(context.env, input.endpointId);

    const encryptedSubmission = await aes.encrypt(
      JSON.stringify(input.data),
      key
    );

    const submissionData: schema.Submission = {
      id: newId('submission'),
      endpointId: input.endpointId,
      iv: encryptedSubmission.iv,
      cipherText: encryptedSubmission.cipherText,
      location: input.location,
      isSpam: false,
      isRead: false,
      createdAt: new Date()
    };

    await Promise.all([
      database.insert(schema.submission).values(submissionData),
      cache.storeSubmission(submissionData)
    ]);

    const pendingUploads = await storage.getUploadLinks(
      database,
      input.fileUploads,
      input.endpointId,
      submissionData.id
    );

    const response = PostResponseSchema.parse({
      ...submissionData,
      pendingUploads: pendingUploads
    });

    return context.json(response, 201);
  });
};
