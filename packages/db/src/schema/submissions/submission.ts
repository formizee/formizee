import {text, jsonb, boolean, timestamp, pgTable} from 'drizzle-orm/pg-core';
import {endpoint} from '../endpoints';
import {relations} from 'drizzle-orm';

export const submission = pgTable('submissions', {
  id: text('id').primaryKey(),

  endpointId: text('endpoint_id')
    .notNull()
    .references(() => endpoint.id, {onDelete: 'set null'}),

  data: jsonb('data').notNull().$type<object>(),

  isSpam: boolean('is_spam').notNull().default(false),

  isRead: boolean('is_read').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const submissionRelations = relations(submission, ({one}) => ({
  endpoint: one(endpoint, {
    fields: [submission.endpointId],
    references: [endpoint.id]
  })
}));
