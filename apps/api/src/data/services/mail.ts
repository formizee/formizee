import nodemailer, {Transporter} from 'nodemailer';
import {SecretsProvider} from '@/lib/secrets'
import {MailService} from 'domain/services';
import {Response, Mail} from 'domain/models';
import {Uid} from 'domain/models/values';

export class MailServiceImplementation implements MailService {
  private readonly smtp: Transporter;

  constructor() {
    const pass = SecretsProvider.getInstance().getSmtp();
    this.smtp = nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: { user: 'resend', pass }
    });
  }

  async send(mail: Mail): Promise<Response<Uid>> {
    const info = await this.smtp.sendMail({
      from: {name: mail.name, address: mail.from},
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    });

    if (!info.messageId) Response.error('Unexpected error.', 500);
    const response = new Uid(info.messageId);

    return Response.success(response, 201);
  }
}
