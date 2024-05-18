'use server';

import type {AuthServiceResetPassword} from 'domain/services/auth';
import type {Email} from 'domain/models/values';
import {createServerClient} from '@/lib/supabase/server';

export const authServiceResetPassword: AuthServiceResetPassword = async (
  email: Email,
) => {
  const supabase = createServerClient();

  const {error} = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: "https://localhost:3000/auth/update-password"
  });

  if (error) {
    return Promise.reject({error});
  }

  return Promise.resolve({error: null});
};

export default authServiceResetPassword;
