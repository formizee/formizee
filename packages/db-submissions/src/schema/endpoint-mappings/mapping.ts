import {text, sqliteTable} from 'drizzle-orm/sqlite-core';
import {database} from '../databases/database';

export const mapping = sqliteTable('form_mappings', {
  endpointId: text('endpoint_id').notNull().primaryKey(),

  databaseId: text('database_id')
    .notNull()
    .references(() => database.id, {onDelete: 'cascade'})
});
