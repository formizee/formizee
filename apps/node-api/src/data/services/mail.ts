import {type Transporter, createTransport} from 'nodemailer';
import type {MailService as Service} from 'domain/services';
import {type Mail, Response} from 'domain/models';
import type {Uid} from 'domain/models/values';

export class MailService implements Service {
  private readonly smtp: Transporter;

  constructor() {
    this.smtp = createTransport({
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async send(mail: Mail): Promise<Response<Uid>> {
    await this.smtp.sendMail({
      from: `${mail.name} <${mail.from}>`,
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    });

    return Response.error('miau');
  }
}
