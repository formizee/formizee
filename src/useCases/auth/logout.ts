import {resolve} from '@/lib/di';

export class LogoutUseCase {
  private readonly service = resolve('authService');

  async run() {
    await this.service.logout();
  }
}
