'use server';

import {createServerClient} from '@/lib/supabase/server';
import {AuthServiceLogin} from 'domain/services/auth';
import {User} from 'domain/models';

export const authServiceLogin: AuthServiceLogin = async (email, password) => {
  const supabase = createServerClient();

  const {data, error} = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password
  });

  if (error) {
    return Promise.resolve({data: null, error});
  }

  const user = new User(
    data.user.id as string,
    data.user.user_metadata.display_name as string,
    data.user.email as string
  );

  return Promise.resolve({data: {user}, error: null});
};

export default authServiceLogin;
