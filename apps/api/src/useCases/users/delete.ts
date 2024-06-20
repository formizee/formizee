/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {Identifier} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class DeleteUser {
  private readonly _repository = resolve('usersRepository');
  private readonly _uid: Identifier;

  constructor(uid: string) {
    this._uid = new Identifier(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.delete(this._uid);
  }
}
