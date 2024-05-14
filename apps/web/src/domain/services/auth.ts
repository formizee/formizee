import {Name, Email, Password} from '@/domain/models/values';
import {User} from '@/domain/models/user';

export type AuthResponse =
  | {
      data: {user: User};
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

export type AuthServiceLogin = (
  email: Email,
  password: string
) => Promise<AuthResponse>;

export type AuthServiceRegister = (
  name: Name,
  email: Email,
  password: Password
) => Promise<AuthResponse>;

export type AuthServiceLogout = () => Promise<{error: Error | null}>;
