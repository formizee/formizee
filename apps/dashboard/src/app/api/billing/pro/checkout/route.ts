import {NextResponse} from 'next/server';
import {billing} from '@/lib/billing';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const GET = auth(async function GET(req) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get('workspaceId') ?? '';

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

  const productPriceId = url.searchParams.get('priceId') ?? '';
  const confirmationUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/billing/confirmation?checkout_id={CHECKOUT_ID}`;

  try {
    const result = await billing.checkouts.custom.create({
      successUrl: confirmationUrl,
      productPriceId,
      metadata: {
        plan: 'pro',
        workspaceId,
        userId: String(req.auth?.user?.id)
      }
    });

    return NextResponse.redirect(result.url);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
});
