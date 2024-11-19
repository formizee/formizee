import {type NextRequest, NextResponse} from 'next/server';
import {database, eq, schema} from '@/lib/db';
import {verify} from 'jsonwebtoken';
import {env} from '@/lib/enviroment';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({
      code: 'BAD_REQUEST',
      message: 'Invalid or missing token'
    });
  }

  let email = '';
  let userId = '';

  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const payload = verify(token, env().AUTH_SECRET) as any;
    email = payload.email;
    userId = payload.userId;
  } catch {
    return NextResponse.json({
      code: 'BAD_REQUEST',
      message: 'Invalid or missing token'
    });
  }

  const emailExists = await database.query.usersToEmails.findFirst({
    where: (table, {eq}) => eq(table.email, email)
  });

  if (!emailExists) {
    return NextResponse.json({
      code: 'NOT_FOUND',
      message: 'Email not found.'
    });
  }

  const user = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, userId)
  });

  if (!user) {
    return NextResponse.json({
      code: 'NOT_FOUND',
      message: 'User not found.'
    });
  }

  // Remove the email
  await database
    .update(schema.usersToEmails)
    .set({
      isVerified: true
    })
    .where(eq(schema.usersToEmails.email, email));

  // Update workspaces availableEmails property
  const workspaces = await database.query.usersToWorkspaces.findMany({
    where: (table, {eq}) => eq(table.userId, user.id),
    with: {
      workspace: true
    }
  });

  for (const workspace of workspaces) {
    const availableEmails = workspace.workspace.availableEmails;
    availableEmails.push(email);

    await database
      .update(schema.workspace)
      .set({availableEmails})
      .where(eq(schema.workspace.id, workspace.workspaceId));
  }

  const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/auth/linked-emails/verified`;
  return NextResponse.redirect(redirectUrl);
}
