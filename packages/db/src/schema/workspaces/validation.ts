import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {workspacePlans} from './constants';
import {workspace} from './workspace';
import {z} from 'zod';

export const insertWorkspaceSchema = createInsertSchema(workspace, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),

  slug: z
    .string()
    .min(8, {message: 'The slug must be between 8 and 64 characters long'})
    .max(64, {message: 'The slug must be between 8 and 64 characters long'})
    .regex(/^[a-z0-9-]+$/, {
      message:
        'The slug must contain only lowercase letters, numbers, and hyphens, with no spaces or special characters.'
    }),

  plan: z.enum(workspacePlans).default('hobby'),

  stripeId: z.string().optional(),
  subscriptionId: z.string().optional(),
  endsAt: z.string().datetime().optional(),
  paidUntil: z.string().datetime().optional()
});
export const selectWorkspaceSchema = createSelectSchema(workspace);

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = z.infer<typeof selectWorkspaceSchema>;
