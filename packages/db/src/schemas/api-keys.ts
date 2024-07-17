import {text, timestamp, index, pgEnum, pgTable} from 'drizzle-orm/pg-core';
import {newId} from '@formizee/id';
import {teams} from './teams';
import {users} from './users';

export const scopes = pgEnum('api_key_scopes', ['full-access', 'team']);

export const apiKeys = pgTable(
  'api_keys',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => newId('api')),

    user: text('user_id')
      .notNull()
      .references(() => users.id, {onDelete: 'cascade'}),

    team: text('team_id').references(() => teams.id, {onDelete: 'cascade'}),

    scope: scopes('scope').notNull().default('full-access'),

    key: text('key').notNull(),

    lastAccess: timestamp('last_access').notNull().defaultNow(),

    createdAt: timestamp('created_at').notNull().defaultNow(),

    expiresAt: timestamp('expires_at')
      .notNull()
      .$default(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
  },
  table => {
    return {
      keyIndex: index('key_index').on(table.key)
    };
  }
);
