'use server';

import {signOut} from '@/lib/auth';
import {redirect} from 'next/navigation';

export const logout = async () => {
  await signOut();
  redirect('/');
};
