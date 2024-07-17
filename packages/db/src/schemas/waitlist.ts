import {newId} from '@formizee/id';
import {text, timestamp, pgTable} from 'drizzle-orm/pg-core';

export const waitlist = pgTable('waitlist', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => newId('waitlist')),

  email: text('email').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow()
});
