import {z} from 'zod';

export const params = z.object({
  endpointId: z.string()
});

export const schema = z.object({
  workspaceId: z.string(),
  endpointId: z.string(),
  uploadedAt: z.number(),
  context: z.object({
    location: z.string(),
    userAgent: z.string().optional()
  })
});
