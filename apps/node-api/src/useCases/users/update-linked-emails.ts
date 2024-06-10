import type {User, Response} from 'domain/models';
import {Uid, LinkedEmail} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateUserLinkedEmails {
  private readonly _repository = resolve('usersRepository');
  private readonly _emails: LinkedEmail[] = [];
  private readonly _uid: Uid;

  constructor(
    uid: string,
    linkedEmails: [{email: string; isVerified: boolean}]
  ) {
    linkedEmails.forEach(item => {
      this._emails.push(new LinkedEmail(item.email, item.isVerified));
    });

    this._uid = new Uid(uid);
  }

  async run(): Promise<Response<User>> {
    return await this._repository.updateLinkedEmails(this._uid, this._emails);
  }
}
