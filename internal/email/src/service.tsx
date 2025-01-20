import type {WorkspacePlans, Limits} from '@formizee/plans';
import {EmailClient as Client} from './base';

import {AuthVerifyLinkedEmail} from '../emails/verify-linked-email';
import {PlanLimitReached} from '../emails/plan-limit-reached';
import {PlanLimitWarning} from '../emails/plan-limit-warning';
import {AuthVerifyEmail} from '../emails/verify-email';
import {SubmissionEmail} from '../emails/submission';
import {render} from '@react-email/components';

export class EmailService {
  private readonly smtp: Client;
  private readonly from = 'Formizee <noreply@formizee.com>';
  private readonly replyTo = 'Formizee Support <support@formizee.com>';

  constructor(options: {accessKey: string; secretAccesKey: string}) {
    this.smtp = new Client(options);
  }

  public async sendVerifyEmail(req: {email: string; link: string}) {
    try {
      const result = await this.smtp.emails.send({
        to: req.email,
        from: this.from,
        replyTo: this.replyTo,
        subject: 'Your login request to Formizee.',
        html: await render(<AuthVerifyEmail link={req.link} />, {pretty: true}),
        plainText: await render(<AuthVerifyEmail link={req.link} />, {
          plainText: true
        })
      });

      if (!result.error) {
        return;
      }
      throw result.error;
    } catch (error) {
      console.error('Error occurred sending authentication email');
      console.error(error);
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
        replyTo: this.replyTo,
        subject: 'New Form Submission!',
        html: await render(
          <SubmissionEmail
            workspaceSlug={req.workspaceSlug}
            endpointSlug={req.endpointSlug}
            endpointName={req.endpointName}
            data={req.data}
          />,
          {pretty: true}
        ),
        plainText: await render(
          <SubmissionEmail
            workspaceSlug={req.workspaceSlug}
            endpointSlug={req.endpointSlug}
            endpointName={req.endpointName}
            data={req.data}
          />,
          {plainText: true}
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
        replyTo: this.replyTo,
        subject: 'Verify Your New Email',
        html: await render(
          <AuthVerifyLinkedEmail email={req.email} link={req.magicLink} />,
          {pretty: true}
        ),
        plainText: await render(
          <AuthVerifyLinkedEmail email={req.email} link={req.magicLink} />,
          {plainText: true}
        )
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
        replyTo: this.replyTo,
        subject: "You've reached the 80% monthly usage of your plan",
        html: await render(
          <PlanLimitWarning
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />,
          {pretty: true}
        ),
        plainText: await render(
          <PlanLimitWarning
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />,
          {plainText: true}
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
        replyTo: this.replyTo,
        subject: "Action Required: You've reached the limits of your plan",
        html: await render(
          <PlanLimitReached
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />,
          {pretty: true}
        ),
        plainText: await render(
          <PlanLimitReached
            limit={req.limitReached}
            username={req.username}
            currentPlan={req.currentPlan}
          />,
          {plainText: true}
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
