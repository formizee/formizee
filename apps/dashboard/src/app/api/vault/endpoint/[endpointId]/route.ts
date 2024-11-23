import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const DELETE = auth(async function DELETE(req, ctx) {
  const endpoint = await database.query.endpoint.findFirst({
    where: (table, {eq}) => eq(table.id, String(ctx.params?.endpointId ?? ''))
  });

  if (!endpoint) {
    return NextResponse.json({}, {status: 200});
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

  await fetch(`https://vault.formizee.com/v1/endpoint/${endpoint.id}`, {
    headers: {Authorization: env().VAULT_SECRET},
    method: 'DELETE'
  });

  return Response.json({}, {status: 200});
});
