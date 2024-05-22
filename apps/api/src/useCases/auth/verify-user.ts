import {Response, User} from 'domain/models';
import {Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class AuthVerifyUser {
  private readonly _service = resolve('authService');
  private readonly _token: string;
  private readonly _email: Email;

  constructor(email: string, token: string) {
    this._email = new Email(email);
    this._token = token;
  }

  public async run(): Promise<Response<User>> {
    return await this._service.verifyUser(this._email, this._token);
  }
}
