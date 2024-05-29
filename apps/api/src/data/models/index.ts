import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {randomUUID} from 'node:crypto';
import {sql} from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  name: text('name', {length: 32}).notNull(),

  email: text('email').notNull().unique(),

  password: text('password', {length: 64}).notNull(),

  isVerified: integer('is_verified', {mode: 'boolean'})
    .notNull()
    .default(false),

  permission: text('permission', {enum: ['admin', 'user']})
    .notNull()
    .default('user'),

  forms: text('forms', {mode: 'json'}).notNull().$type<string[]>().default([]),

  linkedEmails: text('linked_emails', {mode: 'json'})
    .notNull()
    .$type<string[]>(),

  timestamp: text('timestamp')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const endpoints = sqliteTable('endpoints', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  name: text('name', {length: 64}).notNull().default('Untitled Form'),

  owner: text('owner')
    .notNull()
    .references(() => users.id),

  isEnabled: integer('form_enabled', {mode: 'boolean'}).default(true),

  emailNotifications: integer('email_enabled', {mode: 'boolean'}).default(true),

  targetEmail: text('target_mail').notNull(),

  redirectUrl: text('redirect_url').notNull().default(''),

  submissions: text('submissions', {mode: 'json'})
    .notNull()
    .default([])
    .$type<string[]>(),

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

  formData: text('form_data').notNull(),

  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const authTokens = sqliteTable('auth_tokens', {
  email: text('email')
    .primaryKey()
    .references(() => users.email),

  token: integer('token', {mode: 'number'}).notNull(),

  expiresAt: text('expires_at').notNull(),

  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});

export const waitlist = sqliteTable('waitlist', {
  email: text('email').primaryKey().notNull(),

  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
});
