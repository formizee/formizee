import {type Response, type User} from 'domain/models';
import {Email, Name, Password} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class RegisterAuth {
  private readonly _service = resolve('authService');
  private readonly _password: Password;
  private readonly _email: Email;
  private readonly _name: Name;

  constructor(name: string, email: string, password: string) {
    this._password = new Password(password);
    this._email = new Email(email);
    this._name = new Name(name);
  }

  public async run(): Promise<Response<User>> {
    return await this._service.register(
      this._name,
      this._email,
      this._password
    );
  }
}
