import {type Transporter, createTransport} from 'nodemailer';
import type {MailService as Service} from 'domain/services';
import {type Mail, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

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

  async send(mail: Mail): Promise<Response<Identifier>> {
    const data = {
      from: `${mail.name} <${mail.from}>`,
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    };

    this.smtp.sendMail(data, (err, info) => {
      if (err) {
        return Response.error({
          name: err.name,
          description: err.message
        });
      }

      if (info.messageId) {
        return Response.success(new Identifier(info.messageId));
      }
    });

    return Response.error({
      name: 'Internal error',
      description: "The email can't be send"
    });
  }
}
