import type {Name, Email, Password} from '@/models/values';
import type {AuthResponse, AuthState} from './types'
import type {Response, User} from '@/models';

export interface AuthService {
  login(email: Email, password: string): Promise<Response<User>>;
  register(name: Name, email: Email, password: Password): Promise<Response<User>>;
}

export type AuthServiceLogin = (
  email: Email,
  password: string
) => Promise<AuthResponse>;

export type AuthServiceRegister = (
  name: Name,
  email: Email,
  password: Password
) => Promise<AuthResponse>;

export type AuthServiceResetPassword = (email: Email) => Promise<{error: Error | null}>;

export type AuthServiceUpdatePassword = (newPassword: Password) => Promise<AuthResponse>;

export type AuthServiceProtectRoute = (onState: AuthState) => Promise<boolean>;

export type AuthServiceLogout = () => Promise<{error: Error | null}>;
