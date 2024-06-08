import type {Uid, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (identifier: Uid | Email) => Promise<Response<User>>;
  delete: (uid: Uid) => Promise<Response<true>>;
  updateName: (uid: Uid, newName: Name) => Promise<Response<User>>;
  updateEmail: (uid: Uid, newEmail: Email) => Promise<Response<User>>;
  updatePassword: (uid: Uid, newPassword: Password) => Promise<Response<User>>;
  updateForms: (uid: Uid, forms: Uid[]) => Promise<Response<User>>;
  updateLinkedEmails: (
    uid: Uid,
    linkedEmails: Email[]
  ) => Promise<Response<User>>;
}
