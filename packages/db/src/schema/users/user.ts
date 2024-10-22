import {
  text,
  unique,
  pgEnum,
  pgTable,
  boolean,
  integer,
  timestamp,
  primaryKey
} from 'drizzle-orm/pg-core';
import {workspace, workspaceRole} from '../workspaces';
// @ts-ignore
import type {AdapterAccount} from 'next-auth/adapters';
import {memberPermissions} from './constants';
import {relations} from 'drizzle-orm';

export const user = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    image: text('image'),

    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', {mode: 'date'}),

    lastAccess: timestamp('last_access').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
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

export const roles = pgEnum('workspace_role', workspaceRole);
export const permissions = pgEnum('member_permissions', memberPermissions);

export const usersToWorkspaces = pgTable('users_to_workspaces', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, {onDelete: 'cascade'}),

  role: roles('role').notNull().default('member'),

  permissions: permissions('permissions').notNull().default('read'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
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

export const usersToEmails = pgTable('users_to_emails', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),

  email: text('email').notNull(),

  isVerified: boolean('is_verified').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const usersToEmailsRelations = relations(usersToEmails, ({one}) => ({
  user: one(user, {
    fields: [usersToEmails.userId],
    references: [user.id]
  })
}));

// Auth.js //

export const account = pgTable(
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

export const session = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  expires: timestamp('expires', {mode: 'date'}).notNull()
});

export const verificationToken = pgTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {mode: 'date'}).notNull()
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token]
    })
  })
);

export const authenticator = pgTable(
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
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    transports: text('transports')
  },
  authenticator => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID]
    })
  })
);
