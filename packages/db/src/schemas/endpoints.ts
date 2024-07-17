import {text, boolean, timestamp, pgEnum, pgTable} from 'drizzle-orm/pg-core';
import {newId} from '@formizee/id';
import {teams} from './teams';

export const icons = pgEnum('icons', [
  'file',
  'file-chart',
  'start',
  'bookmark',
  'heart',
  'flag',
  'bolt',
  'bell',
  'lightbulb',
  'credit-card',
  'stack',
  'cube',
  'database',
  'server',
  'inbox',
  'calendar',
  'mail',
  'checkcircle',
  'book',
  'chat',
  'user-group',
  'console',
  'tools',
  'grid',
  'moon',
  'sun',
  'cloud',
  'cart',
  'gift',
  'music',
  'beaker',
  'video',
  'code',
  'maps',
  'face-smile',
  'face-frown',
  'paint',
  'bug',
  'school',
  'rocket'
]);

export const colors = pgEnum('colors', [
  'gray',
  'amber',
  'red',
  'lime',
  'teal',
  'cyan',
  'indigo',
  'violet',
  'pink'
]);

export const endpoints = pgTable('endpoints', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('endpoint')),

  name: text('name').notNull(),

  team: text('team')
    .notNull()
    .references(() => teams.name, {onDelete: 'set null'}),

  isEnabled: boolean('is_enabled').notNull().default(true),

  emailNotifications: boolean('email_notifications').notNull().default(true),

  targetEmails: text('target_mail').array().notNull(),

  redirectUrl: text('redirect_url')
    .notNull()
    .default(`${process.env.WEB_URL}/thanks-you`),

  color: colors('color').notNull().default('gray'),

  icon: icons('icon').notNull().default('file'),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
});
