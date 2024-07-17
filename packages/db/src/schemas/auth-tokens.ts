import {text, integer, timestamp, pgTable} from 'drizzle-orm/pg-core';
import {newId} from '@formizee/id';
import {users} from './users';

export const authTokens = pgTable('auth_tokens', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('auth')),

  user: text('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  token: integer('token').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  expiresAt: timestamp('expires_at')
    .notNull()
    .$default(() => new Date(Date.now() + 60 * 60 * 1000))
});
