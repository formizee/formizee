import {text, unique, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {workspacePlans} from './constants';
import {usersToWorkspaces} from '../users';
import {sql, relations} from 'drizzle-orm';
import {endpoint} from '../endpoints';

export const plans = text('workspace_plans', {enum: workspacePlans});

export const workspace = sqliteTable(
  'workspaces',
  {
    id: text('id').primaryKey(),

    name: text('name'),
    slug: text('slug').notNull().unique(),

    availableEmails: text('available_emails', {mode: 'json'})
      .notNull()
      .$type<string[]>()
      .default(sql`(json_array())`),

    plan: plans.notNull().default('hobby'),
    subscriptionId: text('subscription_id'),
    stripeId: text('stripe_id').unique(),
    endsAt: integer('ends_at', {mode: 'timestamp'}),
    paidUntil: integer('paid_until', {mode: 'timestamp'}),

    createdAt: integer('created_at', {mode: 'timestamp'})
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', {mode: 'timestamp'})
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdateFn(() => new Date())
      .$type<Date>()
  },
  table => {
    return {
      slug: unique('slug').on(table.slug)
    };
  }
);

export const workspaceRelations = relations(workspace, ({many}) => ({
  usersToWorkspaces: many(usersToWorkspaces),
  endpoints: many(endpoint)
}));
