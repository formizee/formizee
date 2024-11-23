import {text, index, sqliteTable, integer} from 'drizzle-orm/sqlite-core';
import {workspace} from '../workspaces';
import {relations, sql} from 'drizzle-orm';

export const key = sqliteTable(
  'keys',
  {
    id: text('id').primaryKey(),

    name: text('name').notNull(),

    hash: text('hash').notNull(),

    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, {
        onDelete: 'cascade'
      }),

    lastAccess: integer('last_access', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),
    createdAt: integer('created_at', {mode: 'timestamp'}).notNull().default(sql`(unixepoch())`),

    expiresAt: integer('expires_at', {mode: 'timestamp'})
      .notNull()
      .$default(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
  },
  table => {
    return {
      hash: index('hash').on(table.hash)
    };
  }
);

export const keysRelations = relations(key, ({one}) => ({
  workspace: one(workspace, {
    fields: [key.workspaceId],
    references: [workspace.id]
  })
}));
