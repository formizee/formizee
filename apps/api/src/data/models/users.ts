import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {randomUUID} from 'node:crypto';
import {sql} from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),

  name: text('name', {length: 32}).notNull(),

  email: text('email').notNull().unique(),

  password: text('password', {length: 64}).notNull(),

  forms: text('forms', {mode: 'json'}).notNull().$type<string[]>().default([]),

  linkedEmails: text('linked_emails', {mode: 'json'}).notNull().$type<string[]>(),

  verified: integer("verified", {mode: 'boolean'}).notNull().default(false),

  timestamp: text('timestamp').notNull().default(sql`CURRENT_TIMESTAMP`)
});

