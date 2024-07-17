import {resolve} from '@/lib/di';
import type {Response, User} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';

export class UpdateUserEmail {
  private readonly _repository = resolve('usersRepository');
  private readonly _email: Email;
  private readonly _id: Identifier;

  constructor(id: string, newEmail: string) {
    this._email = new Email(newEmail);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updateEmail(this._id, this._email);
  }
}
