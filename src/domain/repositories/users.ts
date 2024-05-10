import {Uid, Name, Email, Password} from '../models/values';
import {User} from '../models';

export interface UsersRepository {
  get(uid: Uid): Promise<User>;
  delete(uid: Uid): Promise<void>;
  updateName(uid: Uid, newName: Name): Promise<void>;
  updateEmail(uid: Uid, newEmail: Email): Promise<void>;
  updatePassword(uid: Uid, newPassword: Password): Promise<void>;
  updateLinkedEmails(uid: Uid, linkedEmails: Array<Email>): Promise<void>;
  create(uid: Uid, name: Name, email: Email, password: Password): Promise<User>;
}
