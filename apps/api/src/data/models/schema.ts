import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {randomUUID} from 'node:crypto';
import {sql} from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name', {length: 32}).notNull(),
  email: text('email', {length: 32}).notNull().unique(),
  password: text('password', {length: 64}).notNull(),
  forms: text('forms').notNull(),
  linkedEmails: text('linkedEmails').notNull(),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const endpoints = sqliteTable('endpoints', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name', {length: 64}).notNull().default('Untitled Form'),
  submissions: text('submissions').notNull().default('[]'),
  owner: text('owner')
    .references(() => users.id)
    .notNull(),

  isEnabled: integer('isEnabled', {mode: 'boolean'}).default(true),
  emailNotifications: integer('emailNotifications', {mode: 'boolean'}).default(
    true
  ),

  redirectUrl: text('redirectUrl').notNull().default(''),
  targetEmail: text('targetEmail').notNull(),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const submissions = sqliteTable('submissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  endpoint: text('endpoint')
    .references(() => endpoints.id)
    .notNull(),
  formData: text('form').notNull(),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});
