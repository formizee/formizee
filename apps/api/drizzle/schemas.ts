import {
  boolean,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
  pgTable,
  jsonb
} from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';

export const teamRoles = pgEnum('team_roles', ['owner', 'member']);
export const apiKeyScopes = pgEnum('api_key_scopes', ['team', 'full access']);
export const userPermissions = pgEnum('user_permissions', ['read', 'edit', 'create', 'all']);
export const billingPlans = pgEnum('billing_plans', ['hobby', 'professional', 'teams', 'custom']);

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  plan: billingPlans('plan').notNull().default('hobby'),

  availableEmails: text('available_emails')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),

  user: uuid('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  team: uuid('team_id')
    .notNull()
    .references(() => teams.id, {onDelete: 'cascade'}),

  role: teamRoles('role').notNull().default('member'),

  permissions: userPermissions('permissions')
    .notNull()
    .default('read'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

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
});

export const linkedEmails = pgTable('emails', {
  id: uuid('id').defaultRandom().primaryKey(),

  user: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  isVerified: boolean('is_verified').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const endpoints = pgTable('endpoints', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  team: uuid('team_id')
    .notNull()
    .references(() => teams.id, {onDelete: 'set null'}),

  isEnabled: boolean('is_enabled').notNull().default(true),

  emailNotifications: boolean('email_notifications').notNull().default(true),

  targetEmails: text('target_mail').array().notNull(),

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
  id: uuid('id').defaultRandom().primaryKey(),

  endpoint: uuid('endpoint_id')
    .notNull()
    .references(() => endpoints.id, {onDelete: 'set null'}),

  data: jsonb('data').notNull().$type<object>(),

  isSpam: boolean('is_spam').notNull().default(false),

  isRead: boolean('is_read').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const authTokens = pgTable('auth_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),

  user: uuid('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  token: integer('token').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  expiresAt: timestamp('expires_at')
    .notNull()
    .$default(() => new Date(Date.now() + 60 * 60 * 1000))
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),

  user: uuid('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  team: uuid('team_id')
    .references(() => teams.id, {onDelete: 'cascade'}),

  scope: apiKeyScopes('scope').notNull().default('full access'),

  key: uuid('key').notNull().defaultRandom(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  expiresAt: timestamp('expires_at')
    .notNull()
    .$default(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
})

export const waitlist = pgTable('waitlist', {
  id: uuid('id').defaultRandom().primaryKey(),

  email: text('email').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow()
});
