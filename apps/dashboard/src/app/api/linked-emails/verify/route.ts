import {type NextRequest, NextResponse} from 'next/server';
import {database, eq, schema} from '@/lib/db';
import {verify} from 'jsonwebtoken';
import {env} from '@/lib/enviroment';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/auth/error?error=Verification`
    );
  }

  let email = '';
  let userId = '';

  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const payload = verify(token, env().AUTH_SECRET) as any;
    email = payload.email;
    userId = payload.userId;
  } catch {
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/auth/error?error=Verification`
    );
  }

  const emailExists = await database.query.usersToEmails.findFirst({
    where: (table, {eq}) => eq(table.email, email)
  });

  if (!emailExists) {
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/auth/error?error=Verification`
    );
  }

  const user = await database.query.user.findFirst({
    where: (table, {eq}) => eq(table.id, userId)
  });

  if (!user) {
    return NextResponse.redirect(
      `${request.nextUrl.protocol}//${request.nextUrl.host}/auth/error?error=Verification`
    );
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
