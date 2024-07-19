import {z} from '@hono/zod-openapi';

export const PostWaitlistSchema = z.object({
  email: z.string().email('The data needs to be an email').openapi({
    example: 'pauchiner@formizee.com'
  })
});
