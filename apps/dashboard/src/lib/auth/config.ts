import GitHub from 'next-auth/providers/github';
import Resend from 'next-auth/providers/resend';
import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  providers: [GitHub, Resend({from: 'Formizee <noreply@formizee.com>'})],
  pages: {
    verifyRequest: '/auth/verify',
    error: 'auth/error',
    signIn: '/login',
    newUser: '/'
  }
} satisfies NextAuthConfig;
