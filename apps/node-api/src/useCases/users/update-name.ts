import type {User, Response} from 'domain/models';
import {Identifier, Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateUserName {
  private readonly _repository = resolve('usersRepository');
  private readonly _name: Name;
  private readonly _uid: Identifier;

  constructor(uid: string, newName: string) {
    this._name = new Name(newName);
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updateName(this._uid, this._name);
  }
}
