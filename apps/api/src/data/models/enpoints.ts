import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {randomUUID} from 'node:crypto';
import {sql} from 'drizzle-orm';
import {users} from './users';

export const endpoints = sqliteTable('endpoints', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),

  name: text('name', {length: 64}).notNull().default('Untitled Form'),

  owner: text('owner').notNull().references(() => users.id),

  isEnabled: integer('form_enabled', {mode: 'boolean'}).default(true),

  emailNotifications: integer('email_enabled', {mode: 'boolean'}).default(true),

  targetEmail: text('target_mail').notNull(),

  redirectUrl: text('redirect_url').notNull().default(''),

  submissions: text('submissions', {mode: 'json'}).notNull().default([]).$type<string[]>(),

  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`).notNull()
});
