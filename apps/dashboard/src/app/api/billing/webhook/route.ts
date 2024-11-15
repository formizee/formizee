import {Webhook} from 'standardwebhooks';

import type {
  WebhookCheckoutCreatedPayload,
  WebhookCheckoutUpdatedPayload,
  WebhookOrderCreatedPayload,
  WebhookSubscriptionActivePayload,
  WebhookSubscriptionCanceledPayload,
  WebhookSubscriptionCreatedPayload,
  WebhookSubscriptionRevokedPayload,
  WebhookSubscriptionUpdatedPayload
} from '@polar-sh/sdk/models/components';
import {type NextRequest, NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import {database, eq, schema} from '@/lib/db';
import type {WorkspacePlans} from '@formizee/plans';

type WebhookEvent =
  | WebhookOrderCreatedPayload
  | WebhookCheckoutCreatedPayload
  | WebhookCheckoutUpdatedPayload
  | WebhookSubscriptionActivePayload
  | WebhookSubscriptionCreatedPayload
  | WebhookSubscriptionUpdatedPayload
  | WebhookSubscriptionRevokedPayload
  | WebhookSubscriptionCanceledPayload;

export async function POST(request: NextRequest) {
  const requestBody = await request.text();

  const webhookHeaders = {
    'webhook-id': request.headers.get('webhook-id') ?? '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
    'webhook-signature': request.headers.get('webhook-signature') ?? ''
  };

  const webhookSecret = Buffer.from(env().POLAR_WEBHOOK_SECRET).toString(
    'base64'
  );
  const wh = new Webhook(webhookSecret);
  const webhookPayload = wh.verify(requestBody, webhookHeaders) as WebhookEvent;

  switch (webhookPayload.type) {
    case 'order.created': {
      if (
        webhookPayload.data.billingReason !== 'subscription_cycle' ||
        !webhookPayload.data.subscription
      ) {
        return NextResponse.json({});
      }

      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.subscriptionId, webhookPayload.data.subscriptionId ?? '')
      });

      if (!workspace) {
        return NextResponse.json(
          {
            message:
              'Workspace not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }

      await database
        .update(schema.workspace)
        .set({
          endsAt: webhookPayload.data.subscription.currentPeriodEnd,
          paidUntil: webhookPayload.data.subscription.currentPeriodEnd
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    case 'subscription.active': {
      const {plan, workspaceId} = webhookPayload.data.metadata as {
        plan: WorkspacePlans;
        workspaceId: string;
      };

      await database
        .update(schema.workspace)
        .set({
          plan,
          subscriptionId: webhookPayload.data.id,
          endsAt: webhookPayload.data.currentPeriodEnd,
          paidUntil: webhookPayload.data.currentPeriodEnd
        })
        .where(eq(schema.workspace.id, workspaceId));

      break;
    }
    // Subscription has been revoked/peroid has ended with no renewal
    case 'subscription.revoked': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) => eq(table.subscriptionId, webhookPayload.data.id)
      });

      if (!workspace) {
        return NextResponse.json(
          {
            message:
              'Workspace not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }

      await database
        .update(schema.workspace)
        .set({
          plan: 'hobby',
          subscriptionId: webhookPayload.data.id,
          endsAt: webhookPayload.data.endedAt,
          paidUntil: webhookPayload.data.endedAt
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    // Subscription has been explicitly canceled by the user
    case 'subscription.canceled': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) => eq(table.subscriptionId, webhookPayload.data.id)
      });

      if (!workspace) {
        return NextResponse.json(
          {
            message:
              'Workspace not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }

      await database
        .update(schema.workspace)
        .set({
          plan: 'hobby',
          subscriptionId: webhookPayload.data.id,
          endsAt: webhookPayload.data.endedAt,
          paidUntil: webhookPayload.data.endedAt
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }
  }

  return NextResponse.json({received: true});
}
