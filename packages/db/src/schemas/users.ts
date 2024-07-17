import {
  text,
  boolean,
  timestamp,
  uniqueIndex,
  pgTable
} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import {newId} from '@formizee/id';
import {emails} from './emails';

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => newId('user')),

    name: text('name').notNull(),

    password: text('password').notNull(),

    email: text('email').notNull().unique(),

    isVerified: boolean('is_verified').notNull().default(false),

    lastAccess: timestamp('last_access').notNull().defaultNow(),

    createdAt: timestamp('created_at').notNull().defaultNow(),

    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  table => {
    return {
      emailIndex: uniqueIndex('email_index').on(table.email)
    };
  }
);

export const usersRelations = relations(users, ({many}) => ({
  linkedEmails: many(emails)
}));
