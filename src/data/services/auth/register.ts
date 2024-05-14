'use server';

import {AuthServiceRegister} from '@/domain/services/auth';
import {createServerClient} from '@/lib/supabase/server';
import {User} from '@/domain/models';

export const authServiceRegister: AuthServiceRegister = async (
  name,
  email,
  password
) => {
  const supabase = createServerClient();

  const {data, error} = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {display_name: name.value}
    }
  });

  if (error) {
    return Promise.reject({data: null, error});
  }

  const user = new User(
    data.user?.id as string,
    data.user?.user_metadata.display_name as string,
    data.user?.email as string
  );

  return Promise.resolve({data: {user}, error});
};

export default authServiceRegister;
