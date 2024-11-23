import type {Webhook} from '@formizee/billing';
import {database, eq, schema} from '@/lib/db';
import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import crypto from 'node:crypto';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = env().LEMONSQUEEZY_WEBHOOK_SECRET;

  const signature = Buffer.from(
    request.headers.get('X-Signature') ?? '',
    'hex'
  );

  const hmac = Buffer.from(
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex'),
    'hex'
  );

  if (!crypto.timingSafeEqual(hmac, signature)) {
    return new Response('Invalid signature', {status: 400});
  }

  const data = JSON.parse(rawBody) as Webhook;

  switch (data.meta.event_name) {
    case 'subscription_payment_success': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, data.meta.custom_data.workspace_id ?? '')
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
          plan: 'pro',
          stripeId: data.data.attributes.customer_id.toString(),
          subscriptionId: data.data.attributes.subscription_id.toString()
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    case 'subscription_updated': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, data.meta.custom_data?.workspace_id ?? '')
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
          plan: data.data.attributes.cancelled ? 'hobby' : 'pro',
          paidUntil: new Date(data.data.attributes.renews_at),
          endsAt: data.data.attributes.ends_at
            ? new Date(data.data.attributes.ends_at)
            : null
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    case 'subscription_cancelled': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, data.meta.custom_data?.workspace_id ?? '')
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
          plan: 'hobby'
        })
        .where(eq(schema.workspace.id, workspace.id));
      break;
    }

    case 'subscription_expired': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, data.meta.custom_data?.workspace_id ?? '')
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
          plan: 'hobby'
        })
        .where(eq(schema.workspace.id, workspace.id));
      break;
    }
  }

  return NextResponse.json({received: true});
}
