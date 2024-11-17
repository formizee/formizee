import {NextResponse} from 'next/server';
import {BillingService} from '@formizee/billing';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const GET = auth(async function GET(req) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get('workspaceId') ?? '';
  const billing = new BillingService({apiKey: env().LEMONSQUEEZY_API_KEY});

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

  const workspace = await database.query.workspace.findFirst({
    where: (table, {eq}) => eq(table.id, authorized.workspaceId)
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

  try {
    const responseUrl = await billing.getFormizeeSubscriptionPortalUrl(
      workspace.subscriptionId ?? ''
    );

    return NextResponse.redirect(responseUrl);
  } catch {
    return NextResponse.error();
  }
});
