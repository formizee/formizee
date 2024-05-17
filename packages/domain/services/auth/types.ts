import type {User} from '@/models/user';

export type AuthState = "logged" | 'not-logged';

export type AuthResponse =
  | {
      data: {user: User};
      error: null;
    }
  | {
      data: null;
      error: Error;
    };


