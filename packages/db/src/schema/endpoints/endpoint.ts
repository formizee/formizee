import {endpointColor, endpointIcon} from './constants';
import {workspace} from '../workspaces';
import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const icons = text('icons', {enum: endpointIcon});
export const colors = text('colors', {enum: endpointColor});

export const endpoint = sqliteTable('endpoints', {
  id: text('id').primaryKey(),

  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspace.id, {onDelete: 'cascade'}),

  name: text('name'),
  slug: text('slug').notNull(),
  icon: icons.notNull().default('file'),
  color: colors.notNull().default('gray'),

  isEnabled: integer('is_enabled', {mode: 'boolean'}).notNull().default(true),
  emailNotifications: integer('email_notifications', {mode: 'boolean'})
    .notNull()
    .default(true),

  targetEmails: text('target_emails', {mode: 'json'})
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),

  redirectUrl: text('redirect_url').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
});

export const endpointRelations = relations(endpoint, ({one}) => ({
  workspace: one(workspace, {
    fields: [endpoint.workspaceId],
    references: [workspace.id]
  })
}));
