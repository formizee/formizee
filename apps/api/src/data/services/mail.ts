import {type Mail, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import type {MailService as Service} from 'domain/services';
import {type Transporter, createTransport} from 'nodemailer';

interface MailInfo {
  messageId: string;
  envelope: unknown;
  accepted: unknown[];
  rejected: unknown[];
  pending: unknown[];
  response: string;
}

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

  send(mail: Mail): Response<Identifier> {
    const data = {
      from: `${mail.name} <${mail.from}>`,
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    };

    this.smtp.sendMail(data, (err, info: MailInfo) => {
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
