import {
  text,
  unique,
  sqliteTable,
  integer,
  primaryKey
} from 'drizzle-orm/sqlite-core';
import {workspace, workspaceRole} from '../workspaces';
// @ts-ignore
import type {AdapterAccount} from 'next-auth/adapters';
import {memberPermissions} from './constants';
import {relations, sql} from 'drizzle-orm';

export const user = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    image: text('image'),

    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', {mode: 'timestamp'}),

    lastAccess: integer('last_access', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
    createdAt: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', {mode: 'timestamp'})
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => sql`(unixepoch())`)
  },
  table => {
    return {
      slug: unique('slug').on(table.slug),
      email: unique('email').on(table.email)
    };
  }
);

export const userRelations = relations(user, ({many}) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  usersToEmails: many(usersToEmails)
}));

// Users To Workspaces //

export const roles = text('workspace_role', {enum: workspaceRole});
export const permissions = text('member_permissions', {enum: memberPermissions});

export const usersToWorkspaces = sqliteTable('users_to_workspaces', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, {onDelete: 'cascade'}),

  role: roles.notNull().default('member'),

  permissions: permissions.notNull().default('read'),

  createdAt: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),

  updatedAt: integer('updated_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
});

export const usersToWorkspaceRelations = relations(
  usersToWorkspaces,
  ({one}) => ({
    workspace: one(workspace, {
      fields: [usersToWorkspaces.workspaceId],
      references: [workspace.id]
    }),
    user: one(user, {
      fields: [usersToWorkspaces.userId],
      references: [user.id]
    })
  })
);

// Users To Emails //

export const usersToEmails = sqliteTable('users_to_emails', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  isVerified: integer('is_verified', {mode: 'boolean'}).notNull().default(false),

  createdAt: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),

  updatedAt: integer('updated_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
});

export const usersToEmailsRelations = relations(usersToEmails, ({one}) => ({
  user: one(user, {
    fields: [usersToEmails.userId],
    references: [user.id]
  })
}));

// Auth.js //

export const account = sqliteTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId]
    })
  })
);

export const session = sqliteTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationToken = sqliteTable(
  'verificationTokens',
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token]
    })
  })
);

export const authenticator = sqliteTable(
  'authenticators',
  {
    credentialID: text('credential_id').notNull().unique(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
    providerAccountId: text('provider_account_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: integer('credential_backed_up', {mode: 'boolean'}).notNull(),
    transports: text('transports')
  },
  authenticator => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID]
    })
  })
);
