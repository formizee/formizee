import {text, unique, timestamp, pgTable, pgEnum} from 'drizzle-orm/pg-core';
import {workspacePlans} from './constants';
import {usersToWorkspaces} from '../users';
import {sql, relations} from 'drizzle-orm';
import {endpoint} from '../endpoints';

export const plans = pgEnum('workspace_plans', workspacePlans);

export const workspace = pgTable(
  'workspaces',
  {
    id: text('id').primaryKey(),

    name: text('name'),
    slug: text('slug').notNull().unique(),

    availableEmails: text('available_emails')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    plan: plans('plan').notNull().default('hobby'),
    subscriptionId: text('subscription_id'),
    stripeId: text('stripe_id').unique(),
    endsAt: timestamp('ends_at'),
    paidUntil: timestamp('paid_until'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
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
