'use server';

import {signIn} from '@/lib/auth';

export const emailLogin = async (formData: {email: string}) => {
  await signIn('http-email', formData);
};

export const githubLogin = async (redirectTo: string) => {
  await signIn('github', {redirectTo});
};

export const googleLogin = async (redirectTo: string) => {
  await signIn('google', {redirectTo});
};
