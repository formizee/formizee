'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {authServiceProtectRoute} from '@/data/services/auth';

export const protectRoute = async (onState: 'logged' | 'not-logged', redirectTo: string): Promise<void> => {
  const isProtected = await authServiceProtectRoute(onState);

  if (isProtected) {
    revalidatePath('/', 'layout');
    redirect(redirectTo);
  }

};
