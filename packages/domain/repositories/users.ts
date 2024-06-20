import type {Identifier, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (identifier: Identifier | Email) => Promise<Response<User>>;
  delete: (uid: Identifier, password: string) => Promise<Response<true>>;

  updateName: (uid: Identifier, name: Name) => Promise<Response<User>>;
  updateEmail: (uid: Identifier, email: Email) => Promise<Response<User>>;
  updatePassword: (uid: Identifier, password: Password) => Promise<Response<User>>;

  saveLinkedEmail: (uid: Identifier, linkedEmail: Email) => Promise<Response<User>>;
  deleteLinkedEmail: (uid: Identifier, linkedEmail: Email) => Promise<Response<true>>;
}
