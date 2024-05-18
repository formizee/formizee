import { Uid, Name, Email, Password } from 'domain/models/values';
import { UsersRepository } from 'domain/repositories';
import { User } from 'domain/models';

export class UsersRepositoryImplementation implements UsersRepository {
  get(uid: Uid): Promise<User> {
    const user = new User(uid.value, 'example', 'example@mail.com');
    return Promise.resolve(user);
  }

  delete(uid: Uid): Promise<void> {
    throw Error("Not implemented yet");
  }

  updateName(uid: Uid, newName: Name): Promise<void> {
    throw Error("Not implemented yet");

  }
  updateEmail(uid: Uid, newEmail: Email): Promise<void> {
    throw Error("Not implemented yet");

  }
  updatePassword(uid: Uid, newPassword: Password): Promise<void> {
    throw Error("Not implemented yet");

  }
  updateLinkedEmails(uid: Uid, linkedEmails: Email[]): Promise<void> {
    throw Error("Not implemented yet");

  }
  create(uid: Uid, name: Name, email: Email, password: Password): Promise<User> {
    throw Error("Not implemented yet");

  }
}
