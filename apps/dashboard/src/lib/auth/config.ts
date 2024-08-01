import GitHub from 'next-auth/providers/github';
import Resend from 'next-auth/providers/resend';
import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  providers: [GitHub, Resend({from: 'Formizee <noreply@formizee.com>'})],
  pages: {
    signIn: '/login',
    newUser: '/'
  }
} satisfies NextAuthConfig;
