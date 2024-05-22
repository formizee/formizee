import {text, sqliteTable} from 'drizzle-orm/sqlite-core';
import {randomUUID} from 'node:crypto';
import {endpoints} from './enpoints';
import {sql} from 'drizzle-orm';

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),

  endpoint: text('endpoint').references(() => endpoints.id).notNull(),

  formData: text('form_data', {mode: 'json'}).notNull().default([]),

  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`).notNull()
});
