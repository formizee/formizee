import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const schemas = sqliteTable('schemas', {
  endpointId: text('id').notNull().primaryKey(),

  schema: text('schema', {mode: 'json'}).notNull().$type<string>(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
