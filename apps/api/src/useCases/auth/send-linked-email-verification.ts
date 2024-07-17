import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';

export class SendLinkedEmailVerificationAuth {
  private readonly _service = resolve('authService');
  private readonly _email: Email;
  private readonly _user: Identifier;

  constructor(user: string, email: string) {
    this._email = new Email(email);
    this._user = new Identifier(user);
  }

  public async run(): Promise<Response<true>> {
    return await this._service.sendLinkedEmailVerification(
      this._user,
      this._email
    );
  }
}
