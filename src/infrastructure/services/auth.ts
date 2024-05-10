'use server';

import {Name, Email, Password} from '@/domain/models/values';
import {AuthService} from '@/domain/services';
import {User} from '@/domain/models';

import {createServerClient} from '@/lib/supabase/server';

export class SupabaseAuthService implements AuthService {
  private readonly _service = createServerClient();

  login(email: Email, password: Password): Promise<User> {
    return new Promise((resolve, reject) => {
      this._service.auth
        .signInWithPassword({email: email.value, password: password.value})
        .then(auth => {
          const uid = auth?.data?.user?.id as string;
          const email = auth.data.user?.email as string;
          const name = auth?.data?.user?.user_metadata.name as string;

          resolve(new User(uid, name, email));
        })
        .catch(error => reject(error));
    });
  }

  register(name: Name, email: Email, password: Password): Promise<User> {
    return new Promise((resolve, reject) => {
      this._service.auth
        .signUp({
          email: email.value,
          password: password.value,
          options: {
            data: {name: name.value}
          }
        })
        .then(auth => {
          const uid = auth?.data?.user?.id as string;
          const email = auth.data.user?.email as string;
          const name = auth?.data?.user?.user_metadata.name as string;

          resolve(new User(uid, name, email));
        })
        .catch(error => reject(error));
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._service.auth.signOut().catch(error => reject(error));
      resolve();
    });
  }
}
