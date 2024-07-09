import type {Identifier, Name, Email, Password} from '../models/values';
import type {User, Team, Response} from '../models';

export interface UsersRepository {
  load: (userId: Identifier | Email) => Promise<Response<User>>;
  loadLinkedTeams: (userId: Identifier) => Promise<Response<Team[]>>;
  delete: (userId: Identifier, password: string) => Promise<Response<true>>;

  updateName: (userId: Identifier, name: Name) => Promise<Response<User>>;
  updateEmail: (userId: Identifier, email: Email) => Promise<Response<User>>;
  updatePassword: (
    userId: Identifier,
    password: Password
  ) => Promise<Response<User>>;

  saveLinkedEmail: (
    userId: Identifier,
    linkedEmail: Email
  ) => Promise<Response<User>>;
  deleteLinkedEmail: (
    userId: Identifier,
    linkedEmail: Email
  ) => Promise<Response<User>>;
}
