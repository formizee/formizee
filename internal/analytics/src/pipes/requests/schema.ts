import {z} from 'zod';

export const schema = z.object({
  request_id: z.string(),
  time: z.number().int(),
  workspace_id: z.string().default(''),
  host: z.string(),
  method: z.string(),
  path: z.string(),
  request_headers: z.array(z.string()),
  request_body: z.string(),
  response_status: z.number().int(),
  response_headers: z.array(z.string()),
  response_body: z.string(),
  error: z.string().optional().default(''),
  service_latency: z.number().int(),
  user_agent: z.string(),
  ip_address: z.string(),
  continent: z.string().nullable().default(''),
  city: z.string().nullable().default(''),
  country: z.string().nullable().default(''),
  colo: z.string().nullable().default('')
});

export type ApiRequest = z.infer<typeof schema>;
