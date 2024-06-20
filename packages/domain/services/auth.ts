import type {Identifier, Name, Email, Password} from '../models/values';
import type {Response, User} from '../models';

export interface AuthService {
  login: (email: Email, password: string) => Promise<Response<User>>;
  register: (
    name: Name,
    email: Email,
    password: Password
  ) => Promise<Response<User>>;

  sendVerification: (email: Email) => Promise<Response<true>>;
  verify: (email: Email, token: string) => Promise<Response<User>>;

  sendLinkedEmailVerification: (
    user: Identifier,
    linkedEmail: Email
  ) => Promise<Response<true>>;
  verifyLinkedEmail: (jwtToken: string) => Promise<Response<true>>;
}
