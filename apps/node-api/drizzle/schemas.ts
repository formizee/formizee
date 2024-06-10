import {
  boolean,
  text,
  serial,
  bigserial,
  timestamp,
  uuid,
  integer,
  pgEnum,
  pgTable,
  jsonb
} from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';

export const permissions = pgEnum('permissions', ['user', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  password: text('password').notNull(),

  email: text('email').notNull().unique(),

  isVerified: boolean('is_verified').notNull().default(false),

  permission: permissions('permissions').notNull().default('user'),

  forms: uuid('forms')
    .array()
    .notNull()
    .default(sql`ARRAY[]::uuid[]`),

  linkedEmails: text('linked_emails')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  lastAccess: timestamp('last_access').notNull().defaultNow(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const endpoints = pgTable('endpoints', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  owner: uuid('owner')
    .notNull()
    .references(() => users.id, {onDelete: 'set null'}),

  isEnabled: boolean('form_enabled').notNull().default(true),

  emailNotifications: boolean('email_enabled').notNull().default(true),

  targetEmail: text('target_mail').notNull(),

  redirectUrl: text('redirect_url')
    .notNull()
    .default('https://formizee.com/thanks-you'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const submissions = pgTable('submissions', {
  id: bigserial('id', {mode: 'number'}).primaryKey(),

  endpoint: uuid('endpoint')
    .references(() => endpoints.id, {onDelete: 'set null'})
    .notNull(),

  data: jsonb('data').notNull().$type<JSON>(),

  files: text('files')
    .array()
    .default(sql`ARRAY[]::text[]`),

  isSpam: boolean('is_spam').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const authTokens = pgTable('auth_tokens', {
  id: serial('id').primaryKey(),

  token: integer('token').notNull(),

  email: text('email')
    .notNull()
    .references(() => users.email, {onDelete: 'cascade'}),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  expiresAt: timestamp('expires_at')
    .notNull()
    .$default(() => new Date(Date.now() + 60 * 60 * 1000))
});

export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),

  email: text('email').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow()
});