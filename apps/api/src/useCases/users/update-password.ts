import {resolve} from '@/lib/di';
import type {Response, User} from 'domain/models';
import {Identifier, Password} from 'domain/models/values';

export class UpdateUserPassword {
  private readonly _repository = resolve('usersRepository');
  private readonly _password: Password;
  private readonly _id: Identifier;

  constructor(id: string, newPassword: string) {
    this._password = new Password(newPassword);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updatePassword(this._id, this._password);
  }
}
