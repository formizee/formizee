import {authConfig} from './config';
import {adapter} from './adapter';
import NextAuth from 'next-auth';

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter,
  ...authConfig
});
