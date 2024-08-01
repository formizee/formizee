import {DrizzleAdapter} from '@auth/drizzle-adapter';
import type {Adapter} from 'next-auth/adapters';
import {createUser, getUser} from './helpers';
import {database, schema} from '@/lib/db';

// @ts-ignore
export const adapter: Adapter = {
  ...DrizzleAdapter(database, {
    usersTable: schema.user,
    accountsTable: schema.account,
    sessionsTable: schema.session,
    verificationTokensTable: schema.verificationToken
  }),
  createUser: async data => {
    return await createUser(data);
  },
  getUser: async id => {
    return await getUser(id);
  }
};
