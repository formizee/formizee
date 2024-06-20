import type {User, Response} from 'domain/models';
import {Identifier, Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateUserName {
  private readonly _repository = resolve('usersRepository');
  private readonly _name: Name;
  private readonly _id: Identifier;

  constructor(id: string, newName: string) {
    this._name = new Name(newName);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updateName(this._id, this._name);
  }
}
