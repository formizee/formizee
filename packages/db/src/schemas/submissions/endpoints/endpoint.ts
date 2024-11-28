import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const endpoint = sqliteTable('endpoints', {
  id: text('id').notNull().primaryKey(),

  schema: text('schema', {mode: 'json'}).notNull().$type<string>(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
