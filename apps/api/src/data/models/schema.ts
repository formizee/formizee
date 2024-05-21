import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import {randomUUID} from "node:crypto";
import { sql } from "drizzle-orm";

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name', {length: 32}).notNull(),
  email: text('email', {length: 32}).notNull().unique(),
  password: text('password', {length: 64}).notNull(),
  forms: text('forms').notNull(),
  linkedEmails: text('linkedEmails').notNull(),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`).notNull()
});
