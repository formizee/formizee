import type {User, Response} from 'domain/models';
import {Identifier, Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveUserLinkedEmail {
  private readonly _repository = resolve('usersRepository');
  private readonly _email: Email;
  private readonly _id: Identifier;

  constructor(id: string, linkedEmail: string) {
    this._email = new Email(linkedEmail);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.saveLinkedEmail(this._id, this._email);
  }
}
