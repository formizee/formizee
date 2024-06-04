'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import { type ActionState } from '@/types';

export const logout = async (): Promise<ActionState> => {
  if(!process.env.URL) throw new Error("Wepage URL enviroment variable is not defined");

  const response = await fetch(`${process.env.URL}/api/auth/logout`, {
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
