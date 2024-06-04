/*eslint import/no-cycle: [2, { maxDepth: 1 }] -- The depth is allowed in order to reuse cases */

import {Uid, Password} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class UpdateUserPassword {
  private readonly _repository = resolve('usersRepository');
  private readonly _password: Password;
  private readonly _uid: Uid;

  constructor(uid: string, newPassword: string) {
    this._password = new Password(newPassword);
    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.updatePassword(this._uid, this._password);
  }
}
