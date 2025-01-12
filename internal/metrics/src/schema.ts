import {z} from 'zod';

const latencySchema = z.number().transform(latency => Math.round(latency));

export const metricSchema = z.discriminatedUnion('metric', [
  // HTTP metrics
  z.object({
    metric: z.literal('http.request'),
    host: z.string(),
    path: z.string(),
    method: z.string(),
    status: z.number(),
    error: z.string().optional(),
    serviceLatency: latencySchema,
    // ms since worker initilized for the first time
    // a non zero value means the worker is reused
    isolateLifetime: z.number(),
    isolateId: z.string(),
    // Regional data might be different on non-cloudflare deployments
    colo: z.string().optional(),
    continent: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    userAgent: z.string().optional(),
    fromAgent: z.string().optional(),
    context: z.record(z.unknown())
  }),

  // Cache metrics
  z.object({
    metric: z.literal('cache.read'),
    hit: z.boolean(),
    key: z.string(),
    latency: latencySchema
  }),
  z.object({
    metric: z.literal('cache.write'),
    key: z.string(),
    latency: latencySchema
  }),
  z.object({
    metric: z.literal('cache.delete'),
    key: z.string(),
    latency: latencySchema
  }),

  // Database metrics
  z.object({
    metric: z.literal('main.db.read'),
    query: z.enum([
      'users.get',
      'users.list',

      'keys.get',
      'keys.list',
      'keys.count',
      'keys.verify',

      'endpoints.get',
      'endpoints.list',
      'endpoints.count',

      'workspaces.get',
      'workspaces.list',

      'usersToEmails.get',
      'usersToWorkspaces.get',
      'usersToWorkspaces.list'
    ]),
    latency: latencySchema
  }),
  z.object({
    metric: z.literal('main.db.write'),
    mutation: z.enum([
      'users.put',
      'users.post',
      'users.delete',

      'keys.put',
      'keys.post',
      'keys.delete',

      'endpoints.put',
      'endpoints.post',
      'endpoints.delete',

      'workspaces.put',
      'workspaces.post',
      'workspaces.delete',

      'usersToEmails.post',
      'usersToEmails.delete'
    ]),
    latency: latencySchema
  }),
  z.object({
    metric: z.literal('vault.latency'),
    query: z.enum([
      'storage.get',
      'storage.post',
      'submissions.get',
      'submissions.list',
      'submissions.post',
      'submissions.put',
      'submissions.delete',
      'endpoints.metrics',
      'endpoints.delete'
    ]),
    latency: latencySchema
  }),

  // Entities Metrics
  z.object({
    metric: z.literal('submission.upload'),
    workspaceId: z.string(),
    endpointId: z.string(),
    uploadedAt: z.date(),
    context: z.object({
      location: z.string(),
      userAgent: z.string().optional()
    })
  }),

  z.object({
    metric: z.literal('endpoint.created'),
    workspaceId: z.string(),
    context: z.object({
      location: z.string(),
      userAgent: z.string().optional()
    })
  }),

  z.object({
    metric: z.literal('user.created'),
    workspaceId: z.string(),
    context: z.object({
      location: z.string(),
      userAgent: z.string().optional()
    })
  }),

  z.object({
    metric: z.literal('api.request'),
    workspaceId: z.string(),
    time: z.date(),
    context: z.object({
      location: z.string(),
      userAgent: z.string().optional()
    })
  }),

  z.object({
    metric: z.literal('vault.request'),
    time: z.date(),
    context: z.object({
      location: z.string(),
      userAgent: z.string().optional()
    })
  })
]);

export type Metric = z.infer<typeof metricSchema>;
