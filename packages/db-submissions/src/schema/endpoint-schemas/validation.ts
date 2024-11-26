import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {endpointSchema} from './schema';
import {z} from 'zod';

export const insertEndpointSchemaSchema = createInsertSchema(endpointSchema, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message:
      'Invalid endpoint identifier, please check that is correctly typed.'
  }),
  schema: z.string()
});
export const selectEndpointSchemaSchema = createSelectSchema(endpointSchema, {
  schema: z.string()
});

export type InsertEndpointSchema = z.infer<typeof insertEndpointSchemaSchema>;
export type EndpointSchema = z.infer<typeof selectEndpointSchemaSchema>;
