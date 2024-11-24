import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {database} from './database';
import {z} from 'zod';

export const insertDatabaseSchema = createInsertSchema(database, {
  id: z.string().uuid(),
  url: z.string().url(),
  token: z.string()
});
export const selectDatabaseSchema = createSelectSchema(database);

export type InsertDatabase = z.infer<typeof insertDatabaseSchema>;
export type Database = z.infer<typeof selectDatabaseSchema>;
