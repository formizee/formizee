import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {relations, sql} from 'drizzle-orm';
import {endpoint} from '../endpoints';

export const submission = sqliteTable('submissions', {
  id: text('id').primaryKey(),

  endpointId: text('endpoint_id')
    .notNull()
    .references(() => endpoint.id, {onDelete: 'cascade'}),

  iv: text('data_iv').notNull(),

  cipherText: text('data_cipher_text').notNull(),

  isSpam: integer('is_spam', {mode: 'boolean'}).notNull().default(false),

  isRead: integer('is_read', {mode: 'boolean'}).notNull().default(false),

  location: text('location').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});

export const submissionRelations = relations(submission, ({one}) => ({
  endpoint: one(endpoint, {
    fields: [submission.endpointId],
    references: [endpoint.id]
  })
}));
