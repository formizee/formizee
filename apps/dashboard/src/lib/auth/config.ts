import {sendVerificationRequest} from './helpers';
import Google from '@auth/core/providers/google';
import GitHub from 'next-auth/providers/github';
import Resend from 'next-auth/providers/resend';
import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true
    }),
    Resend({
      from: 'Formizee <noreply@formizee.com>',
      sendVerificationRequest({identifier, url, provider}) {
        sendVerificationRequest({provider, identifier, url});
      }
    })
  ],
  pages: {
    verifyRequest: '/auth/verify',
    error: '/auth/error',
    signIn: '/login',
    newUser: '/'
  }
} satisfies NextAuthConfig;
