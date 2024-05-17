'use server';

import type {AuthServiceProtectRoute} from 'domain/services/auth';
import {createServerClient} from '@/lib/supabase/server';

export const authServiceProtectRoute: AuthServiceProtectRoute = async (onState: 'logged' | 'not-logged') => {
  const supabase = createServerClient();

  const {error, data} = await supabase.auth.getUser();

  switch(onState) {
    case 'logged':
      if (!error && data.user.id) return Promise.resolve(true);
      break;
    case 'not-logged':
      if (error || !data.user.id) return Promise.resolve(true);
      break;
  }
  return Promise.resolve(false);
};

export default authServiceProtectRoute;
