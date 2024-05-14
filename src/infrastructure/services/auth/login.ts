'use server';

import {AuthServiceLogin} from '@/domain/services/auth';
import {createServerClient} from '@/lib/supabase/server';
import {User} from '@/domain/models';

export const authServiceLogin: AuthServiceLogin = async (email, password) => {
  const supabase = createServerClient();

  const {data, error} = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password
  });

  if (error) {
    return Promise.reject(error);
  }

  const user = new User(
    data.user.id as string,
    data.user.user_metadata.display_name as string,
    data.user.email as string
  );

  return Promise.resolve(user);
};

export default authServiceLogin;
