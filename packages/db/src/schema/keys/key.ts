import {text, index, timestamp, pgTable} from 'drizzle-orm/pg-core';
import {workspace} from '../workspaces';
import {relations} from 'drizzle-orm';

export const key = pgTable(
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

    lastAccess: timestamp('last_access').notNull().defaultNow(),

    createdAt: timestamp('created_at').notNull().defaultNow(),

    expiresAt: timestamp('expires_at')
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
