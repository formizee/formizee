import type {User, Response} from 'domain/models';
import {Identifier, Password} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateUserPassword {
  private readonly _repository = resolve('usersRepository');
  private readonly _password: Password;
  private readonly _uid: Identifier;

  constructor(uid: string, newPassword: string) {
    this._password = new Password(newPassword);
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updatePassword(this._uid, this._password);
  }
}
