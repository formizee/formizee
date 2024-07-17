import {resolve} from '@/lib/di';
import type {Response, User} from 'domain/models';
import {Email} from 'domain/models/values';

export class VerifyAuth {
  private readonly _service = resolve('authService');
  private readonly _token: string;
  private readonly _email: Email;

  constructor(email: string, token: string) {
    this._email = new Email(email);
    this._token = token;
  }

  public async run(): Promise<Response<User>> {
    return await this._service.verify(this._email, this._token);
  }
}
