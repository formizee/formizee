import {render} from '@react-email/components';
import {createTransport} from 'nodemailer';
import type {Email} from './types';
import {env} from '../env';

const smtp = createTransport({
  host: env.SMTP_HOST,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD
  }
});

export const sendEmail = async (email: Email) => {
  const html = render(email.template);

  await smtp.sendMail({
    subject: email.subject,
    from: email.from,
    to: email.to,
    html
  });
};
