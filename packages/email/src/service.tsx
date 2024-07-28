import {Resend as Client} from 'resend';

import {render} from '@react-email/components';

import {AuthVerifyEmail} from '../emails/verify-email';
import {AuthVerifyLinkedEmail} from '../emails/verify-linked-email';

export class EmailService {
  private readonly smtp: Client;
  private readonly from = 'noreply@formizee.com';
  private readonly replyTo = 'support@formizee.com';

  constructor(options: {apiKey: string}) {
    this.smtp = new Client(options.apiKey);
  }

  public async sendVerifyEmail(req: {email: string; tokenCode: string}) {
    const html = render(<AuthVerifyEmail tokenCode={req.tokenCode} />);
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'Verify Your Formizee Account',
        html
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      console.error(
        'Error occurred sending authentication email',
        JSON.stringify(error)
      );
    }
  }

  public async sendVerifyLinkedEmail(req: {email: string; magicLink: string}) {
    const html = render(
      <AuthVerifyLinkedEmail email={req.email} link={req.magicLink} />
    );
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'Verify Your New Email',
        html
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      console.error(
        'Error occurred sending authentication email',
        JSON.stringify(error)
      );
    }
  }
}
