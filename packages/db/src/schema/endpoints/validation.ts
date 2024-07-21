import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {endpointColor, endpointIcon} from './constants';
import {endpoint} from './endpoint';
import {z} from 'zod';

export const insertEndpointSchema = createInsertSchema(endpoint, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  slug: z
    .string()
    .min(4, {message: 'The name must be between 4 and 64 characters long.'})
    .max(64, {message: 'The name must be between 4 and 64 characters long.'})
    .regex(/^[a-z0-9.-]+$/, {
      message:
        'The name must contain only lowercase letters, numbers adn hyphens, with no space or special characters.'
    }),
  isEnabled: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  redirectUrl: z.string().url({
    message: 'Invalid redirect url, please check that is correctly typed.'
  }),
  targetEmails: z
    .string()
    .email({
      message: 'Invalid email address, please check that is correctly typed.'
    })
    .array(),
  icon: z.enum(endpointIcon).default('file'),
  color: z.enum(endpointColor).default('gray')
});

export const selectEndpointSchema = createSelectSchema(endpoint);

export type InsertEndpoint = z.infer<typeof insertEndpointSchema>;
export type Endpoint = z.infer<typeof selectEndpointSchema>;
