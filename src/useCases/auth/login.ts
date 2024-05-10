import {Email, Password} from '@/domain/models/values';
import {resolve} from '@/lib/di';

export class LoginUseCase {
  private readonly service = resolve('authService');

  async run(email: string, password: string) {
    const _email = new Email(email);
    const _password = new Password(password);

    await this.service.login(_email, _password);
  }
}
