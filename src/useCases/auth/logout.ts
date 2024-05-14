'use server';

import {authServiceLogout} from '@/infrastructure/services/auth';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export const logout = async (): Promise<ActionState | void> => {
  await authServiceLogout().catch(error => {
    return {
      code: 'EXISTS_ERROR',
      key: 'logout',
      message: error.message
    };
  });

  revalidatePath('/', 'layout');
  redirect('/login');
};
