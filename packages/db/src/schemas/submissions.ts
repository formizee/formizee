import {text, jsonb, boolean, timestamp, pgTable} from 'drizzle-orm/pg-core';
import {endpoints} from './endpoints';
import {newId} from '@formizee/id';

export const submissions = pgTable('submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('submission')),

  endpoint: text('endpoint_id')
    .notNull()
    .references(() => endpoints.id, {onDelete: 'set null'}),

  data: jsonb('data').notNull().$type<object>(),

  isSpam: boolean('is_spam').notNull().default(false),

  isRead: boolean('is_read').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow()
});
