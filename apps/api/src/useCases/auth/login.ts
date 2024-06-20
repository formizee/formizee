import {type Response, type User} from 'domain/models';
import {Email} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoginAuth {
  private readonly _service = resolve('authService');
  private readonly _password: string;
  private readonly _email: Email;

  constructor(email: string, password: string) {
    this._email = new Email(email);
    this._password = password;
  }

  public async run(): Promise<Response<User>> {
    return await this._service.login(this._email, this._password);
  }
}
