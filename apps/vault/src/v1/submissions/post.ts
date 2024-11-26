import {assignOriginDatabase} from '@/lib/databases';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {validateSubmission} from '@/lib/schemas';
import {schema} from '@formizee/db-submissions';
import {createRoute} from '@hono/zod-openapi';
import {aes} from '@formizee/encryption';
import {PostSchema} from './schema';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/',
  request: {
    body: {
      content: {
        'multipart/form-data': {
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
          schema: schema.selectSubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(postRoute, async context => {
    const {database, cache, keys, storage} = context.get('services');
    const input = context.req.valid('form');

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

    // Check if submission already exists
    const submissionExists = await originDatabase.query.submission.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (submissionExists) {
      throw new HTTPException(409, {
        message: 'Submission already exists'
      });
    }

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

    // Store submission
    const submissionData: schema.Submission = {
      id: input.id,
      endpointId: input.endpointId,
      iv: encryptedSubmission.iv,
      cipherText: encryptedSubmission.cipherText,
      location: input.location,
      isSpam: false,
      isRead: false,
      createdAt: new Date()
    };

    const [submission] = await Promise.all([
      originDatabase
        .insert(schema.submission)
        .values(submissionData)
        .returning(),
      cache.storeSubmission(submissionData)
    ]);

    const response = schema.selectSubmissionSchema.parse(submission[0]);

    // Handle file uploads
    if (input.fileUploads) {
      await storage.handleFileUploads(
        database,
        input.fileUploads,
        input.endpointId,
        input.id
      );
    }

    return context.json(response, 201);
  });
};
