import {NextResponse} from 'next/server';
import {env} from '@/lib/enviroment';
import {database} from '@/lib/db';
import {auth} from '@/lib/auth';

export const GET = auth(async function GET(req, ctx) {
  const endpoint = await database.query.endpoint.findFirst({
    where: (table, {eq}) => eq(table.id, String(ctx.params?.endpointId ?? ''))
  });

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

  const response = await fetch('https://vault.formizee.com/v1/submissions', {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include',
    body: JSON.stringify({endpointId: ctx.params?.endpointId}),
    headers: {
      Authorization: env().VAULT_SECRET,
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();
  return Response.json(result);
});
