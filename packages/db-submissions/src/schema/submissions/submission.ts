import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const submission = sqliteTable('submissions', {
  id: text('id').primaryKey(),

  endpointId: text('endpoint_id').notNull(),

  data: text('data', {mode: 'json'}).notNull().$type<object>(),

  isSpam: integer('is_spam', {mode: 'boolean'}).notNull().default(false),

  isRead: integer('is_read', {mode: 'boolean'}).notNull().default(false),

  location: text('location').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});
