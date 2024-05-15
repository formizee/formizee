'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authServiceLogout } from '@/data/services/auth';
import type { ActionState } from '@/types';

export const logout = async (): Promise<ActionState | undefined> => {
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
