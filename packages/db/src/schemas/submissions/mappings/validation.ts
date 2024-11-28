import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {mappings} from './mapping';
import {z} from 'zod';

export const insertEndpointMappingSchema = createInsertSchema(mappings, {
  endpointId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid form identifier, please check that is correctly typed.'
  }),

  databaseId: z.string()
});
export const selectEndpointMappingSchema = createSelectSchema(mappings);

export type InsertEndpointMapping = z.infer<typeof insertEndpointMappingSchema>;
export type EndpointMapping = z.infer<typeof selectEndpointMappingSchema>;
