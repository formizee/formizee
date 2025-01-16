import {allowedEvents, type Event} from '@formizee/billing/webhooks';
import {BillingService} from '@formizee/billing';
import {database, eq, schema} from '@/lib/db';
import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';

const webhookSecret = env().STRIPE_WEBHOOK_SECRET;

async function processEvent(event: Event, billing: BillingService) {
  if (!allowedEvents.includes(event?.type)) {
    return;
  }

  switch (event.type) {
    // Upgrade plan on payment succeeded
    case 'invoice.payment_succeeded': {
      const customerId = event.data.object.customer as string;
      const customer = await billing.getStripeCustomer(customerId);

      if (!customer) {
        return NextResponse.json(
          {
            message:
              'Stripe customer not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }

      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, customer.metadata.workspaceId ?? 'ws_1234')
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
          subscriptionId: event.data.object.id
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    // Assign a stripe id to the workspace
    case 'customer.created': {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, event.data.object.metadata.workspaceId ?? 'ws_1234')
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
          stripeId: event.data.object.id
        })
        .where(eq(schema.workspace.id, workspace.id));

      break;
    }

    // Update subscription dates
    case 'customer.subscription.updated': {
      const customerId = event.data.object.customer as string;
      const customer = await billing.getStripeCustomer(customerId);

      if (!customer) {
        return NextResponse.json(
          {
            message:
              'Stripe customer not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }

      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, customer.metadata.workspaceId ?? '')
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
          subscriptionId: event.data.object.id,
          endsAt: new Date(Number(event.data.object.current_period_end * 1000))
        })
        .where(eq(schema.workspace.id, workspace.id));
      break;
    }

    // Disable plan
    case 'customer.subscription.deleted': {
      const customerId = event.data.object.customer as string;
      const customer = await billing.getStripeCustomer(customerId);

      if (!customer) {
        return NextResponse.json(
          {
            message:
              'Stripe customer not found, please contact with support@formizee.com'
          },
          {status: 404}
        );
      }
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) =>
          eq(table.id, customer.metadata.workspaceId ?? '')
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

    default:
      console.info(`[STRIPE HOOK] event not tracked ${event.type}`);
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();

  const billing = new BillingService({
    apiKey: env().STRIPE_SECRET_KEY,
    testMode: env().VERCEL_ENV === 'development'
  });

  if (!signature) {
    return NextResponse.json({}, {status: 400});
  }

  async function doEventProcessing() {
    if (typeof signature !== 'string') {
      throw new Error("[STRIPE HOOK] Header isn't a string???");
    }

    const event = billing.buildWebhookEvent(body, signature, webhookSecret);

    await processEvent(event, billing);
  }

  await doEventProcessing().catch(error => {
    console.error('[STRIPE HOOK] Error processing event', error);
  });

  return NextResponse.json({received: true});
}
