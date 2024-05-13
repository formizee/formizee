import {Name, Email, Password} from '../models/values';
import {User} from '../models/user';

export interface AuthService {
  login(email: Email, password: string): Promise<User>;
  register(name: Name, email: Email, password: Password): Promise<User>;
  logout(): Promise<void>;
}

export default AuthService;
