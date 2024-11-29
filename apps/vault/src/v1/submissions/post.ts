import {PostResponseSchema, PostSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {validateSubmission} from '@/lib/schemas';
import {schema} from '@formizee/db/submissions';
import {createRoute} from '@hono/zod-openapi';
import {aes} from '@formizee/encryption';
import {newId} from '@formizee/id';
import {assignOriginDatabase} from '@/lib/databases';

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

    // Assign database
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

    // Schema validation
    const submissionIsValid = await validateSubmission(originDatabase, input);

    if (!submissionIsValid) {
      throw new HTTPException(403, {
        message: 'The submission does not match the current endpoint schema'
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
      originDatabase.insert(schema.submission).values(submissionData),
      cache.storeSubmission(submissionData),
      cache.invalidateSubmissions(input)
    ]);

    const pendingUploads = await storage.getUploadLinks(
      originDatabase,
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
