import type {User, Response} from 'domain/models';
import {Uid, Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateUserEmail {
  private readonly _repository = resolve('usersRepository');
  private readonly _email: Email;
  private readonly _uid: Uid;

  constructor(uid: string, newEmail: string) {
    this._email = new Email(newEmail);
    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updateEmail(this._uid, this._email);
  }
}