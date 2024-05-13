import {Email, Password} from '@/domain/models/values';
import {resolve} from '@/lib/di';

export class LoginUseCase {
  private readonly service = resolve('authService');

  async run(email: string, password: string) {
    const _email = new Email(email);

    await this.service.login(_email, password);
  }
}
