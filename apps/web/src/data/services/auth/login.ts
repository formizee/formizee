'use server';

import type { AuthServiceLogin } from 'domain/services/auth';
import { User } from 'domain/models';
import type { Email } from 'domain/models/values';
import { createServerClient } from '@/lib/supabase/server';

export const authServiceLogin: AuthServiceLogin = async (
  email: Email,
  password
) => {
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password
  });

  if (error) {
    return Promise.resolve({ data: null, error });
  }

  const user = new User(
    data.user.id,
    data.user.user_metadata.display_name as string,
    email.value
  );

  return Promise.resolve({ data: { user }, error: null });
};

export default authServiceLogin;
