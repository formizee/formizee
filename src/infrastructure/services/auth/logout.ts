'use server';

import {AuthServiceLogout} from '@/domain/services/auth';
import {createServerClient} from '@/lib/supabase/server';

export const authServiceLogout: AuthServiceLogout = async () => {
  const supabase = createServerClient();

  const {error} = await supabase.auth.signOut();

  if (error) {
    return Promise.reject(error);
  }
};

export default authServiceLogout;
