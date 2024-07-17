'use server';

import type {ActionState} from '@/types';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export const logout = async (): Promise<ActionState> => {
  const response = await fetch(`${process.env.WEB_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  const {error} = await response.json();

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  cookies().delete('session');

  redirect('/');
};
