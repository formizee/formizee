import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';
import {users} from './users';

export const authTokens = sqliteTable('auth_tokens', {
  email: text("email").primaryKey().references(() => users.email),

  token: integer("token", {mode: 'number'}).notNull(),

  expiresAt: text('expires_at').notNull(),

  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`).notNull()
})

export default authTokens;
