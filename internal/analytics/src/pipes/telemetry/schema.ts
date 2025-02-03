import {z} from 'zod';

export const schema = z.object({
  request_id: z.string(),
  time: z.number().int(),
  runtime: z.string(),
  platform: z.string(),
  versions: z.array(z.string())
});

export type SDKTelemetry = z.infer<typeof schema>;
