'use server';

import type { AuthServiceRegister } from 'domain/services/auth';
import { User } from 'domain/models';
import type { Email, Name, Password } from 'domain/models/values';
import { createServerClient } from '@/lib/supabase/server';

export const authServiceRegister: AuthServiceRegister = async (
  name: Name,
  email: Email,
  password: Password
) => {
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { display_name: name.value }
    }
  });

  if (error || !data.user?.id) {
    return Promise.reject({ data: null, error });
  }

  const user = new User(
    data.user.id,
    data.user.user_metadata.display_name as string,
    email.value
  );

  return Promise.resolve({ data: { user }, error });
};

export default authServiceRegister;
