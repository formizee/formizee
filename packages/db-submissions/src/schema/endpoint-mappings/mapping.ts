import {text, sqliteTable, integer} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const mapping = sqliteTable('form_mappings', {
  endpointId: text('endpoint_id').notNull().primaryKey(),

  databaseId: text('database_id').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`),

  updatedAt: integer('updated_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date())
    .$type<Date>()
});
