import {z} from 'zod';

export const Param = z.object({
  endpoint: z.string(),
  id: z.string()
});

export const GetAll = z.object({
  endpoint: z.string()
});

export const Post = z.object({
  endpoint: z
    .string()
    .uuid('Endpoint not found, please review your endpoint URL.')
});

export const Patch = z.object({
  isSpam: z.boolean()
});
