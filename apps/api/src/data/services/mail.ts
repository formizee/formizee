import {SecretsProvider} from '@/lib/secrets'
import {MailService} from 'domain/services';
import {Response, Mail} from 'domain/models';
import {Uid} from 'domain/models/values';
import {Resend} from 'resend';

export class MailServiceImplementation implements MailService {
  private readonly smtp: Resend;

  constructor() {
    const apiKey = SecretsProvider.getInstance().getSmtp();
    this.smtp = new Resend(apiKey);
  }

  async send(mail: Mail): Promise<Response<Uid>> {
    const {data, error} = await this.smtp.emails.send({
      from: `${mail.name} <${mail.from}>`,
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    });

    if (error || !data?.id) return Response.error('Unexpected error.', 500);

    const response = new Uid(data?.id);
    return Response.success(response, 201);
  }
}
