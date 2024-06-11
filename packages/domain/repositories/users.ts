import type {Uid, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (identifier: Uid | Email) => Promise<Response<User>>;
  delete: (uid: Uid, password: string) => Promise<Response<true>>;

  updateName: (uid: Uid, name: Name) => Promise<Response<User>>;
  updateEmail: (uid: Uid, email: Email) => Promise<Response<User>>;
  updatePassword: (uid: Uid, password: Password) => Promise<Response<User>>;

  addLinkedEmail: (uid: Uid, linkedEmail: Email) => Promise<Response<User>>;
  deleteLinkedEmail: (uid: Uid, linkedEmail: Email) => Promise<Response<true>>;
}
