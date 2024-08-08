import {text, boolean, timestamp, pgEnum, pgTable} from 'drizzle-orm/pg-core';
import {endpointColor, endpointIcon} from './constants';
import {workspace} from '../workspaces';
import {relations} from 'drizzle-orm';

export const icons = pgEnum('icons', endpointIcon);
export const colors = pgEnum('colors', endpointColor);

export const endpoint = pgTable('endpoints', {
  id: text('id').primaryKey(),

  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, {onDelete: 'cascade'}),

  name: text('name'),
  slug: text('slug').notNull(),
  icon: icons('icon').notNull().default('file'),
  color: colors('color').notNull().default('gray'),

  isEnabled: boolean('is_enabled').notNull().default(true),
  emailNotifications: boolean('email_notifications').notNull().default(true),

  targetEmails: text('target_emails').array().notNull(),
  redirectUrl: text('redirect_url').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const endpointRelations = relations(endpoint, ({one}) => ({
  workspace: one(workspace, {
    fields: [endpoint.workspaceId],
    references: [workspace.id]
  })
}));
