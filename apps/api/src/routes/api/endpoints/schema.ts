import {z} from 'zod';

export const saveSchema = z.object({
  name: z.string().min(4).max(32)
})
