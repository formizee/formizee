import {Name, Email, Password} from '@/domain/models/values';
import {AuthService} from '@/domain/services';
import {User} from '@/domain/models';

import {createBrowserClient} from '@/lib/supabase/client';
import {useRouter} from 'next/navigation';

export class SupabaseAuthService implements AuthService {
  private readonly _service = createBrowserClient();

  login(email: Email, password: string): Promise<User> {
    'use server';
    return new Promise((resolve, reject) => {
      this._service.auth
        .signInWithPassword({email: email.value, password: password})
        .then(auth => {
          if (auth.error) {
            reject(auth.error);
            return;
          }

          const uid = auth?.data?.user?.id as string;
          const email = auth.data.user?.email as string;
          const name = auth?.data?.user?.user_metadata.display_name as string;

          resolve(new User(uid, name, email));
        })
        .catch(error => reject(error));
    });
  }

  register(name: Name, email: Email, password: Password): Promise<User> {
    'use server';
    return new Promise((resolve, reject) => {
      this._service.auth
        .signUp({
          email: email.value,
          password: password.value,
          options: {
            data: {display_name: name.value}
          }
        })
        .then(auth => {
          if (auth.error) {
            reject(auth.error);
            return;
          }

          const uid = auth?.data?.user?.id as string;
          const email = auth.data.user?.email as string;
          const name = auth?.data?.user?.user_metadata.display_name as string;

          resolve(new User(uid, name, email));
        })
        .catch(error => reject(error));
    });
  }

  logout(): Promise<void> {
    'use server';
    return new Promise((resolve, reject) => {
      const router = useRouter();
      console.log(router);
      this._service.auth
        .signOut()
        .then(auth => {
          if (auth.error) {
            reject(auth.error);
            return;
          }
        })
        .catch(error => reject(error));
      resolve();
    });
  }
}
