'use server';

import type {AuthServiceUpdatePassword} from 'domain/services/auth';
import type {Password} from 'domain/models/values';
import { User } from 'domain/models';
import {createServerClient} from '@/lib/supabase/server';

export const authServiceUpdatePassword: AuthServiceUpdatePassword = async (
  newPassword: Password,
) => {
  const supabase = createServerClient();

  const {data, error} = await supabase.auth.updateUser({
    password: newPassword.value
  });

  if (error || !data.user.email) {
    return Promise.reject({data: null, error});
  }

  const user = new User(
    data.user.id,
    data.user.user_metadata.display_name as string,
    data.user.email ?? 'null'
  )

  return Promise.resolve({data: {user}, error: null});
};

export default authServiceUpdatePassword;
