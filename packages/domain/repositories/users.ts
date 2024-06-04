import type {Uid, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (identifier: Uid | Email) => Promise<Response<User>>;
  save: (
    name: Name,
    email: Email,
    password: Password
  ) => Promise<Response<User>>;
  delete: (uid: Uid) => Promise<Response<true>>;

  updateName: (uid: Uid, newName: Name) => Promise<Response<true>>;
  updateEmail: (uid: Uid, newEmail: Email) => Promise<Response<true>>;
  updatePassword: (uid: Uid, newPassword: Password) => Promise<Response<true>>;
  updateLinkedEmails: (
    uid: Uid,
    linkedEmails: Email[]
  ) => Promise<Response<true>>;
}
