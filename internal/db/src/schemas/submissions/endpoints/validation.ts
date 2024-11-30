import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {endpoint} from './endpoint';
import {z} from 'zod';

export const insertEndpointSchemaSchema = createInsertSchema(endpoint, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  schema: z.string()
});
export const selectEndpointSchemaSchema = createSelectSchema(endpoint, {
  schema: z.string()
});

export type InsertEndpoint = z.infer<typeof insertEndpointSchemaSchema>;
export type Endpoint = z.infer<typeof selectEndpointSchemaSchema>;
