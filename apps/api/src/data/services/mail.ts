import {type MailService} from 'domain/services';
import {Response, type Mail} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {Resend} from 'resend';
import {SecretsProvider} from '@/lib/secrets';

export class MailServiceImplementation implements MailService {
  private readonly smtp: Resend;

  constructor() {
    const apiKey = SecretsProvider.getInstance().getSmtp();
    this.smtp = new Resend(apiKey);
  }

  async send(mail: Mail): Promise<Response<Identifier>> {
    const {data, error} = await this.smtp.emails.send({
      from: `${mail.name} <${mail.from}>`,
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    });

    if (error) return Response.error('Unexpected error.', 500);
    if (!data?.id) return Response.error('Unexpected error.', 500);

    const response = new Identifier(data.id);
    return Response.success(response, 201);
  }
}
