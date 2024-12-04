import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const endpoint = sqliteTable('endpoints', {
  id: text('id').notNull().primaryKey(),

  schema: text('schema', {mode: 'json'}).notNull().$type<string>(),

  storageUsed: integer('storage_used').notNull().default(0),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
