import {Resend as Client} from 'resend';
import type {WorkspacePlans, Limits} from '@formizee/plans';

import {SubmissionEmail} from '../emails/submission';
import {AuthVerifyEmail} from '../emails/verify-email';
import {PlanLimitWarning} from '../emails/plan-limit-warning';
import {PlanLimitReached} from '../emails/plan-limit-reached';
import {AuthVerifyLinkedEmail} from '../emails/verify-linked-email';

export class EmailService {
  private readonly smtp: Client;
  private readonly from = 'Formizee <noreply@formizee.com>';
  private readonly replyTo = 'Formizee Support <support@formizee.com>';

  constructor(options: {apiKey: string}) {
    this.smtp = new Client(options.apiKey);
  }

  public async sendVerifyEmail(req: {email: string; link: string}) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'Your login request to Formizee.',
        react: <AuthVerifyEmail link={req.link} />
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
    endpointName: string;
    email: string;
    data: object;
  }) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'New Form Submission!',
        react: (
          <SubmissionEmail
            workspaceSlug={req.workspaceSlug}
            endpointSlug={req.endpointSlug}
            endpointName={req.endpointName}
            data={req.data}
          />
        )
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      const err = error as Error;
      console.error('Error occurred sending submission email', err.message);
    }
  }

  public async sendVerifyLinkedEmail(req: {email: string; magicLink: string}) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        reply_to: this.replyTo,
        subject: 'Verify Your New Email',
        react: <AuthVerifyLinkedEmail email={req.email} link={req.magicLink} />
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

  public async sendPlanLimitWarningEmail(req: {
    email: string;
    username: string;
    limitReached: keyof Limits;
    currentPlan: WorkspacePlans;
  }) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: 'payments@formizee.com',
        reply_to: this.replyTo,
        subject: "You've reached the 80% monthly usage of your plan",
        react: (
          <PlanLimitWarning
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />
        )
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

  public async sendPlanLimitReachedEmail(req: {
    email: string;
    username: string;
    limitReached: keyof Limits;
    currentPlan: WorkspacePlans;
  }) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: 'payments@formizee.com',
        reply_to: this.replyTo,
        subject: "Action Required: You've reached the limits of your plan",
        react: (
          <PlanLimitReached
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />
        )
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
