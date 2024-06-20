/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {Identifier, Name} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class UpdateUserName {
  private readonly _repository = resolve('usersRepository');
  private readonly _name: Name;
  private readonly _uid: Identifier;

  constructor(uid: string, newName: string) {
    this._name = new Name(newName);
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.updateName(this._uid, this._name);
  }
}
