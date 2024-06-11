import {type Response} from 'domain/models';
import {Email, Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SendLinkedEmailVerificationAuth {
  private readonly _service = resolve('authService');
  private readonly _email: Email;
  private readonly _user: Uid;

  constructor(user: string, email: string) {
    this._email = new Email(email);
    this._user = new Uid(user);
  }

  public async run(): Promise<Response<true>> {
    return await this._service.sendLinkedEmailVerification(
      this._user,
      this._email
    );
  }
}
