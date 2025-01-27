import {sendVerificationRequest} from './helpers';
import Google from '@auth/core/providers/google';
import GitHub from 'next-auth/providers/github';
import type {NextAuthConfig} from 'next-auth';
import {database} from '@/lib/db';
import {allowNewUsers} from '@/flags';

export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true
    }),
    {
      id: 'http-email',
      type: 'email',
      name: 'Email',
      from: 'Formizee <noreply@formizee.com>',
      maxAge: 60 * 60 * 24,
      sendVerificationRequest,
      options: {}
    }
  ],
  callbacks: {
    signIn: async ({user}) => {
      // Disable new signups by feature flag
      const enabled = await allowNewUsers();
      if (!enabled) {
        // Always allow formizee emails.
        if (user.email?.includes('@formizee.com')) {
          return true;
        }

        const userExists = await database.query.user.findFirst({
          where: (table, {eq}) => eq(table.id, user.id ?? '')
        });

        if (!userExists) {
          return '/auth/error?error=Disabled';
        }
      }

      return true;
    }
  },
  pages: {
    verifyRequest: '/auth/verify',
    error: '/auth/error',
    signIn: '/login',
    newUser: '/'
  }
} satisfies NextAuthConfig;
