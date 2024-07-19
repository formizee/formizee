import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import {type Transporter, createTransport} from 'nodemailer';
import {render} from '@react-email/components';
import {env} from '../env';

export interface Email {
  template: React.ReactElement;
  subject: string;
  from: string;
  to: string;
}

const defaultTransport = createTransport({
  host: env.SMTP_HOST,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD
  }
});

export const sendEmail = async (
  email: Email,
  transport?: Transporter<SMTPTransport.SentMessageInfo>
) => {
  const {to, from, subject, template} = email;
  const html = render(template);

  const smtp = transport ?? defaultTransport;

  return await smtp.sendMail({
    subject,
    from,
    to,
    html
  });
};
