import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {key} from './key';
import {z} from 'zod';

export const insertKeySchema = createInsertSchema(key, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  name: z
    .string()
    .min(8, {message: 'The name must be between 8 and 64 characters long'})
    .max(64, {message: 'The name must be between 8 and 64 characters long'}),
  hash: z.string(),

  workspaceId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),

  expiresAt: z.date()
});
export const selectKeySchema = createSelectSchema(key);

export type InsertKey = z.infer<typeof insertKeySchema>;
export type Key = z.infer<typeof selectKeySchema>;
