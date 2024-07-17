import {text, boolean, timestamp, pgTable} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import {newId} from '@formizee/id';
import {users} from './users';

export const emails = pgTable('emails', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('email')),

  user: text('user_id').references(() => users.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  isVerified: boolean('is_verified').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const emailsRelations = relations(emails, ({one}) => ({
  user: one(users, {
    fields: [emails.user],
    references: [users.id]
  })
}));
