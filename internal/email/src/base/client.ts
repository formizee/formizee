import type {ClientBaseConfig} from './types';
import {EmailsService} from './emails';

export class EmailClient {
  public emails: EmailsService;

  constructor(options: ClientBaseConfig) {
    this.emails = new EmailsService(options);
  }
}
