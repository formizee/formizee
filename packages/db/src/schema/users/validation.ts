import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {checkPasswordComplexity} from './utils';
import {user} from './user';
import {z} from 'zod';

export const insertUserSchema = createInsertSchema(user, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  name: z
    .string()
    .min(8, {message: 'The name must be between 8 and 64 characters long'})
    .max(64, {message: 'The name must be between 8 and 64 characters long'}),
  slug: z
    .string()
    .min(8, {message: 'The slug must be between 8 and 64 characters long'})
    .max(64, {message: 'The slug must be between 8 and 64 characters long'})
    .regex(/^[a-z0-9-]+$/, {
      message:
        'The slug must contain only lowercase letters, numbers, and hyphens, with no spaces or special characters.'
    }),
  email: z.string().email({
    message: 'The email is not valid, please check that is correctly typed.'
  }),
  password: z
    .string()
    .min(8, {message: 'Password must be between 8 and 64 characters long'})
    .max(64, {message: 'Password must be between 8 and 64 characters long'})
}).superRefine(checkPasswordComplexity);

export const selectUserSchema = createSelectSchema(user).omit({password: true});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
