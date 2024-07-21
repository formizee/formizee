import {
  text,
  boolean,
  timestamp,
  unique,
  pgTable,
  pgEnum
} from 'drizzle-orm/pg-core';
import {workspace, workspaceRole} from '../workspaces';
import {relations} from 'drizzle-orm';

export const user = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
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

export const usersToWorkspaces = pgTable('users_to_workspaces', {
  userId: text('user_id')
    .notNull()
    .references(() => user.id),

  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id),

  role: roles('role').notNull().default('member'),

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
    .references(() => user.id),

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
