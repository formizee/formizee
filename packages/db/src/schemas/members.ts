import {text, timestamp, pgEnum, pgTable} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import {newId} from '@formizee/id';
import {users} from './users';
import {teams} from './teams';

export const teamRoles = pgEnum('team_roles', ['owner', 'member']);
export const userPermissions = pgEnum('user_permissions', [
  'read',
  'edit',
  'create',
  'all'
]);

export const members = pgTable('members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('member')),

  user: text('user_id')
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),

  team: text('team_id')
    .notNull()
    .references(() => teams.id, {onDelete: 'cascade'}),

  role: teamRoles('role').notNull().default('member'),

  permissions: userPermissions('permissions').notNull().default('read'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});

export const membersRelations = relations(members, ({one}) => ({
  user: one(users, {
    fields: [members.user],
    references: [users.id]
  }),
  team: one(teams, {
    fields: [members.team],
    references: [teams.id]
  })
}));
