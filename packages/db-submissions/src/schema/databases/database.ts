import {text, sqliteTable, integer} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const database = sqliteTable('databases', {
  id: text('id').notNull().primaryKey(),

  url: text('url').notNull(),

  token: text('token').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
