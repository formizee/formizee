import type {Name, Email, Password} from '../models/values';
import type {Response, User} from '../models';

export interface AuthService {
  login: (email: Email, password: string) => Promise<Response<User>>;
  register: (
    name: Name,
    email: Email,
    password: Password
  ) => Promise<Response<User>>;

  sendVerification: (email: Email) => Promise<Response<true>>;
  verifyUser: (email: Email, token: string) => Promise<Response<User>>;
  resetPassword: (email: Email, token: string) => Promise<Response<User>>;
}
