import {Resend as Client} from 'resend';
import type {WorkspacePlans, Limits} from '@formizee/plans';

import {render} from '@react-email/components';

import {SubmissionEmail} from '../emails/submission';
import {AuthVerifyEmail} from '../emails/verify-email';
import {PlanLimitReached} from '../emails/plan-limit-reached';
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

  public async sendSubmissionEmail(req: {
    workspaceSlug: string;
    endpointSlug: string;
    email: string;
    data: object;
  }) {
    const html = render(
      <SubmissionEmail
        workspaceSlug={req.workspaceSlug}
        endpointSlug={req.endpointSlug}
        data={req.data}
      />
    );
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'New Form Submission!',
        html
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      console.error(
        'Error occurred sending submission email',
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

  public async sendPlanLimitReachedEmail(req: {
    email: string;
    username: string;
    limitReached: keyof Limits;
    currentPlan: WorkspacePlans;
  }) {
    const html = render(
      <PlanLimitReached
        limit={req.limitReached}
        username={req.username}
        currentPlan={req.currentPlan}
      />
    );
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'New Form Submission!',
        html
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      console.error(
        'Error occurred sending submission email',
        JSON.stringify(error)
      );
    }
  }
}
