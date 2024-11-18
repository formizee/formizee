import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const DELETE = auth(async function DELETE(req, ctx) {
  const endpoint = await database.query.endpoint.findFirst({
    where: (table, {eq}) => eq(table.id, String(ctx.params?.endpointId ?? ''))
  });

  const submissionId = String(ctx.params?.submissionId) ?? '';

  if (!endpoint) {
    return NextResponse.json(
      {code: 'NOT_FOUND', message: 'Endpoint not found.'},
      {status: 404}
    );
  }

  const authorized = await database.query.usersToWorkspaces.findFirst({
    where: (table, {and, eq}) =>
      and(
        eq(table.userId, req.auth?.user?.id ?? ''),
        eq(table.workspaceId, endpoint.workspaceId)
      )
  });

  if (!authorized) {
    return NextResponse.json(
      {
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to view this endpoint.'
      },
      {status: 401}
    );
  }

  try {
    await fetch(
      `https://vault.formizee.com/v1/submission/${endpoint.id}/${submissionId}`,
      {
        headers: {
          Authorization: env().VAULT_SECRET
        },
        method: 'DELETE'
      }
    );

    return NextResponse.json({});
  } catch {
    return NextResponse.error();
  }
});
