'use server';

import {AuthServiceLogout} from 'domain/services/auth';
import {createServerClient} from '@/lib/supabase/server';

export const authServiceLogout: AuthServiceLogout = async () => {
  const supabase = createServerClient();

  const {error} = await supabase.auth.signOut();

  return Promise.resolve({error});
};

export default authServiceLogout;
