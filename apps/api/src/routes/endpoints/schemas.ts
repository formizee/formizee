import {z} from 'zod';

export const Post = z.object({
  name: z.string().min(8).max(64)
});

export const Patch = z.object({
  isEnabled: z.boolean().optional(),
  redirectUrl: z.string().url().optional(),
  emailNotifications: z.boolean().optional(),
  name: z.string().min(8).max(64).optional(),
  targetEmail: z.string().email().optional()
});

export const Param = z.object({
  id: z.string()
});