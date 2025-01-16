import {BillingService} from '@formizee/billing';
import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const GET = auth(async function GET(req) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get('workspaceId') ?? '';

  const billing = new BillingService({
    apiKey: env().STRIPE_SECRET_KEY,
    testMode: env().VERCEL_ENV !== 'production'
  });

  const workspace = await database.query.workspace.findFirst({
    where: (table, {eq}) => eq(table.id, workspaceId)
  });

  if (!workspace) {
    return NextResponse.json(
      {
        code: 'NOT_FOUND',
        message: 'Workspace not found.'
      },
      {status: 404}
    );
  }

  const authorized = await database.query.usersToWorkspaces.findFirst({
    where: (table, {and, eq}) =>
      and(
        eq(table.userId, req.auth?.user?.id ?? ''),
        eq(table.workspaceId, workspaceId)
      )
  });

  if (!authorized || authorized.role !== 'owner') {
    return NextResponse.json(
      {
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to upgrade this plan.'
      },
      {status: 401}
    );
  }

  const successUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/billing/confirmation`;
  const cancelUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/`;

  const responseUrl = await billing.createFormizeeProPlanCheckout({
    cancelUrl: cancelUrl,
    successUrl: successUrl,
    workspaceId: workspace.id,
    stripeId: workspace.stripeId,
    email: req.auth?.user?.email ?? ''
  });

  if (!responseUrl) {
    return NextResponse.error();
  }

  return NextResponse.redirect(responseUrl);
});
