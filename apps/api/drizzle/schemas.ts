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

export const teamRoles = pgEnum('team_roles', ['owner', 'member']);
export const userPermissions = pgEnum('user_permissions', ['read', 'edit', 'create', 'delete']);
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

  user: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}),

  team: uuid('team_id').references(() => teams.id, {onDelete: 'cascade'}),

  role: teamRoles('role').notNull().default('member'),

  permissions: userPermissions('permissions')
    .array()
    .notNull()
    .default(['read']),

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

  permission: permissions('permissions').notNull().default('user'),

  forms: uuid('forms')
    .array()
    .notNull()
    .default(sql`ARRAY[]::uuid[]`),

  linkedEmails: jsonb('linked_emails')
    .notNull()
    .$type<{email: string; isVerified: boolean}[]>(),

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

  data: jsonb('data').notNull().$type<object>(),

  isSpam: boolean('is_spam').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const authTokens = pgTable('auth_tokens', {
  id: serial('id').primaryKey(),

  token: integer('token').notNull(),

  user: uuid('user')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

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
