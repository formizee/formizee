import {SubmissionSchema, EndpointParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {uploadObject} from '@/lib/storage';

import {SubmissionEmail} from '@formizee/email/templates';
import {
  checkSubmissionPlanLimits,
  sendPlanLimitReached,
  sendPlanLimitNear
} from '@/lib/limits';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Submissions'],
  summary: 'Create a submission',
  path: '/{endpointId}',
  security: [],
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
          schema: SubmissionSchema.omit({data: true})
        }
      }
    },
    302: {
      description: 'Create a submission'
    },
    ...openApiErrorResponses
  }
});

export const registerPostSubmission = (api: typeof submissionsApi) => {
  return api.openapi(postRoute, async context => {
    const {endpointId} = context.req.valid('param');
    const location = context.get('location');

    const {
      analytics,
      vault,
      metrics,
      database,
      logger,
      email: emailService
    } = context.get('services');

    const contentType = context.get('bodyContentType');
    const input = context.get('body');

    const queryEndpointStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, endpointId)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryEndpointStart
        });
      });

    if (!endpoint) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/not-found');
      }
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (!endpoint.isEnabled) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/disabled');
      }
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    const queryWorkspaceStart = performance.now();
    const workspace = await database.query.workspace
      .findFirst({
        where: (table, {eq}) => eq(table.id, endpoint.workspaceId)
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryWorkspaceStart
        });
      });

    if (!workspace) {
      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/not-found');
      }
      throw new HTTPException(404, {
        message: 'Workspace not found'
      });
    }

    // Check plan limits.

    const currentUsage = await checkSubmissionPlanLimits(
      {workspace},
      {database, vault, analytics}
    );

    if (
      currentUsage.submissions === '100%' ||
      currentUsage.storage === '100%'
    ) {
      const limit =
        currentUsage.submissions === '100%' ? 'submissions' : 'storage';

      const {error} = await sendPlanLimitReached(
        {limit, workspace, environment: context.env.ENVIROMENT},
        {database, smtp: emailService}
      );

      if (error) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }

        throw error;
      }

      if (contentType !== 'application/json') {
        return context.redirect('https://formizee.com/f/disabled');
      }
      throw new HTTPException(403, {
        message: 'The endpoint is currently not accepting submissions'
      });
    }

    if (currentUsage.submissions === '80%' || currentUsage.storage === '80%') {
      const limit =
        currentUsage.submissions === '80%' ? 'submissions' : 'storage';

      const {error} = await sendPlanLimitNear(
        {limit, workspace, environment: context.env.ENVIROMENT},
        {database, smtp: emailService}
      );

      if (error) {
        if (contentType !== 'application/json') {
          return context.redirect('https://formizee.com/f/error');
        }

        throw error;
      }
    }

    // Publish submission

    const fileUploads = input.fileUploads.map(entry => {
      return {name: entry.file.name, field: entry.field};
    });

    const {data, error} = await vault.submissions.post({
      endpointId: endpoint.id,
      fileUploads: fileUploads,
      data: input.data,
      location
    });

    if (error) {
      logger.error(`vault.submissions.post(${endpointId})`, {error});
      if (contentType !== 'application/json') {
        return context.redirect(
          `https://formizee.com/f/error?message=${error.message}`
        );
      }
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    // Uploads files

    if (data.pendingUploads.length > 0) {
      let storageUsed = 0;
      await Promise.all(
        data.pendingUploads.map(async pending => {
          if (pending.url === null) {
            return;
          }
          for (const upload of input.fileUploads) {
            if (upload.field === pending.field) {
              storageUsed += upload.file.size;
              await uploadObject(pending.url, upload.file).catch(error => {
                logger.error(
                  `Error uploading pending files on submission ${data.id}`,
                  {error}
                );
              });
            }
          }
        })
      );
      await vault.storage.put({endpointId: endpoint.id, storageUsed});
    }

    // Send the submission email

    if (
      endpoint.emailNotifications &&
      context.env.ENVIROMENT === 'production'
    ) {
      for (const email of endpoint.targetEmails) {
        await emailService.emails.send({
          reply_to: 'Formizee Support <support@formizee.com>',
          from: 'Formizee <noreply@formizee.com>',
          subject: 'New Form Submission!',
          to: email,
          react: (
            <SubmissionEmail
              workspaceSlug={workspace.slug}
              endpointSlug={endpoint.slug}
              data={input.data}
            />
          )
        });
      }
    }

    // Ingest metrics

    await metrics.forceEmit({
      metric: 'submission.upload',
      endpointId: endpoint.id,
      workspaceId: workspace.id,
      uploadedAt: new Date(),
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    if (contentType === 'application/json') {
      const response = SubmissionSchema.omit({data: true}).parse(data);
      return context.json(response, 201);
    }

    return context.redirect(endpoint.redirectUrl);
  });
};
