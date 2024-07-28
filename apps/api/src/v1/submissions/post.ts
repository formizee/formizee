import {SubmissionSchema, EndpointParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {getOriginCountry} from '@/lib/location';
import {createRoute} from '@hono/zod-openapi';
import {db, schema} from '@formizee/db';
import {newId} from '@formizee/id';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/{id}',
  request: {
    params: EndpointParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: true,
            example: {name: 'example', email: 'example@formizee.com'}
          }
        },
        'multipart/form-data': {
          schema: {
            type: 'object',
            additionalProperties: true
          }
        },
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            additionalProperties: true
          }
        }
      },
      required: true
    }
  },
  responses: {
    201: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsApi) => {
  return api.openapi(postRoute, async context => {
    const {analytics, emailService} = context.get('services');
    const contentType = context.req.header('Content-Type');
    const location = await getOriginCountry(context);
    const workspaceId = context.get('workspace').id;
    const {id} = context.req.valid('param');

    const endpoint = await db.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, id)
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (endpoint.workspaceId !== workspaceId) {
      throw new HTTPException(401, {
        message: 'This submission belongs to another workspace'
      });
    }

    const workspace = await db.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, workspaceId)
    });

    if (!workspace) {
      throw new HTTPException(404, {
        message: 'Workspace not found'
      });
    }

    if (!endpoint.isEnabled) {
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    const isForm = contentType?.includes('application/x-www-form-urlencoded');
    const isJson = contentType?.includes('application/json');
    // const isMultipartForm = contentType?.includes('multipart/form-data');

    if (isForm) {
      const form = await context.req.formData();
      const input = Object.fromEntries(form);

      if (Object.keys(input).length === 0) {
        throw new HTTPException(400, {
          message: 'The submission data is empty'
        });
      }

      const data: schema.InsertSubmission = {
        id: newId('submission'),
        endpointId: endpoint.id,
        data: input,
        location
      };

      const newSubmission = await db
        .insert(schema.submission)
        .values(data)
        .returning();

      if (endpoint.emailNotifications) {
        for (const email of endpoint.targetEmails) {
          await emailService.sendSubmissionEmail({
            email,
            data: input,
            endpointSlug: endpoint.slug,
            workspaceSlug: workspace.slug
          });
        }
      }

      await analytics.ingestFormizeeMetrics({
        metric: 'submission.upload',
        endpointId: endpoint.id,
        workspaceId,
        uploadedAt: new Date(),
        context: {
          location: context.get('location'),
          userAgent: context.get('userAgent')
        }
      });

      const response = SubmissionSchema.parse(newSubmission[0]);
      return context.json(response, 201);
    }

    if (isJson) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const input = await context.req.json<any>();
      if (Object.keys(input).length === 0) {
        throw new HTTPException(400, {
          message: 'The submission data is empty'
        });
      }

      const data: schema.InsertSubmission = {
        id: newId('submission'),
        endpointId: endpoint.id,
        data: input,
        location
      };

      const newSubmission = await db
        .insert(schema.submission)
        .values(data)
        .returning();

      if (endpoint.emailNotifications) {
        for (const email of endpoint.targetEmails) {
          await emailService.sendSubmissionEmail({
            email,
            data: input,
            endpointSlug: endpoint.slug,
            workspaceSlug: workspace.slug
          });
        }
      }

      await analytics.ingestFormizeeMetrics({
        metric: 'submission.upload',
        endpointId: endpoint.id,
        workspaceId,
        uploadedAt: new Date(),
        context: {
          location: context.get('location'),
          userAgent: context.get('userAgent')
        }
      });

      const response = SubmissionSchema.parse(newSubmission[0]);
      return context.json(response, 201);
    }

    throw new HTTPException(400, {
      message:
        "Use one of the supported body types: 'application/json' or 'application/x-www-form-urlencoded'"
    });
  });
};
