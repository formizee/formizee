import {Name, Email, Password} from '../models/values';
import {User} from '../models';

export type AuthServiceLogin = (
  email: Email,
  password: string
) => Promise<User>;

export type AuthServiceRegister = (
  name: Name,
  email: Email,
  password: Password
) => Promise<User>;

export type AuthServiceLogout = () => Promise<void>;
