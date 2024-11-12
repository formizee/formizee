'use server';

import {redirect} from 'next/navigation';
import {signOut} from '@/lib/auth';

export const logout = async () => {
  await signOut();
  redirect('/');
};
