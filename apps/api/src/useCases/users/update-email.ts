import type {User, Response} from 'domain/models';
import {Identifier, Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

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
