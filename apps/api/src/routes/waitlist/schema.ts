import {z} from 'zod';

export const joinSchema = z.object({
  email: z.string().email()
})
