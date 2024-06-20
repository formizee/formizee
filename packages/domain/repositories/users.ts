import type {Identifier, Name, Email, Password} from '../models/values';
import type {User, Response} from '../models';

export interface UsersRepository {
  load: (id: Identifier | Email) => Promise<Response<User>>;
  delete: (id: Identifier, password: string) => Promise<Response<true>>;

  updateName: (id: Identifier, name: Name) => Promise<Response<User>>;
  updateEmail: (id: Identifier, email: Email) => Promise<Response<User>>;
  updatePassword: (
    id: Identifier,
    password: Password
  ) => Promise<Response<User>>;

  saveLinkedEmail: (
    id: Identifier,
    linkedEmail: Email
  ) => Promise<Response<User>>;
  deleteLinkedEmail: (
    id: Identifier,
    linkedEmail: Email
  ) => Promise<Response<true>>;
}
