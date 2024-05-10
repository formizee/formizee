import {Name, Email, Password} from '@/domain/models/values';
import {resolve} from '@/lib/di';

export class RegisterUseCase {
  private readonly service = resolve('authService');

  async run(name: string, email: string, password: string) {
    const _name = new Name(name);
    const _email = new Email(email);
    const _password = new Password(password);

    await this.service.register(_name, _email, _password);
  }
}
