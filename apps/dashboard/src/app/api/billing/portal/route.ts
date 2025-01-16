import {NextResponse} from 'next/server';
import {BillingService} from '@formizee/billing';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const GET = auth(async function GET(req) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get('workspaceId') ?? '';
  const billing = new BillingService({apiKey: env().STRIPE_SECRET_KEY});

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
        message: 'You do not have permission to manage this workspace.'
      },
      {status: 401}
    );
  }

  try {
    const responseUrl = await billing.getFormizeeSubscriptionPortalUrl(
      workspace.stripeId ?? ''
    );

    return NextResponse.redirect(responseUrl);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
});
