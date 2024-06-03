import type {Uid, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (identifier: Uid | Email) => Promise<Response<User>>;
  save: (
    name: Name,
    email: Email,
    password: Password
  ) => Promise<Response<User>>;
  delete: (uid: Uid) => Promise<Response<void>>;

  updateName: (uid: Uid, newName: Name) => Promise<Response<void>>;
  updateEmail: (uid: Uid, newEmail: Email) => Promise<Response<void>>;
  updatePassword: (uid: Uid, newPassword: Password) => Promise<Response<void>>;
  updateLinkedEmails: (
    uid: Uid,
    linkedEmails: Email[]
  ) => Promise<Response<void>>;
}
