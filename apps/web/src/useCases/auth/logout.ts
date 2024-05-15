'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authServiceLogout } from '@/data/services/auth';
import { ActionState } from '@/types';

export const logout = async (): Promise<ActionState | void> => {
  const { error } = await authServiceLogout();

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
};
