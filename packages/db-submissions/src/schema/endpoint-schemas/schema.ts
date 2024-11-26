import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const endpointSchema = sqliteTable('endpoint_schemas', {
  id: text('id').notNull().primaryKey(),

  schema: text('schema', {mode: 'json'}).notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
