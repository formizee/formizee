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

  const user = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, authorized.userId)
  });

  if (!user) {
    return NextResponse.json(
      {
        code: 'NOT_FOUND',
        message: 'User not found.'
      },
      {status: 404}
    );
  }

  const confirmationUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/billing/confirmation`;

  try {
    const responseUrl = await billing.createFormizeeProPlanCheckout({
      email: user.email,
      variantId: '467798',
      redirectUrl: confirmationUrl,
      workspaceId: authorized.workspaceId,
      storeId: env().LEMONSQUEEZY_STORE_ID
    });

    return NextResponse.redirect(responseUrl);
  } catch {
    return NextResponse.error();
  }
});
