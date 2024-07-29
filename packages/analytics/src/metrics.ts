import {z} from 'zod';

export const metricSchema = z.discriminatedUnion('metric', [
  // HTTP metrics
  z.object({
    metric: z.literal('http.request'),
    host: z.string(),
    path: z.string(),
    method: z.string(),
    status: z.number(),
    error: z.string().optional(),
    serviceLatency: z.number(),
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

  // Database metrics
  z.object({
    metric: z.literal('db.read'),
    query: z.enum([
      'keys.verify',

      'submissions.load',
      'submissions.create',
      'submissions.update',
      'submissions.delete'
    ]),
    latency: z.number()
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
  })
]);

export type Metric = z.infer<typeof metricSchema>;
