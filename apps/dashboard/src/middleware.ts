import {database, schema, eq} from './lib/db';
import {NextResponse} from 'next/server';
import {auth} from '@/lib/auth';

export default auth(async req => {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (!req.auth && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.auth?.user?.id && pathname === '/') {
    const getUser = async (id: string) => {
      return await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.id, id)
      });
    };

    const user = await getUser(req.auth.user.id);

    if (!user) {
      throw new Error('User not found.');
    }

    const getWorspaces = async (userId: string) => {
      return await database
        .select()
        .from(schema.usersToWorkspaces)
        .innerJoin(
          schema.user,
          eq(schema.user.id, schema.usersToWorkspaces.userId)
        )
        .innerJoin(
          schema.workspace,
          eq(schema.workspace.id, schema.usersToWorkspaces.workspaceId)
        )
        .where(eq(schema.user.id, userId));
    };

    const allowedWorkspaces = await getWorspaces(user.id);

    if (!allowedWorkspaces || !allowedWorkspaces[0]?.workspaces) {
      throw new Error('Workspaces not found.');
    }

    const workspace = allowedWorkspaces[0].workspaces;

    const getEndpoints = async (workspaceId: string) => {
      return await database.query.endpoint.findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspaceId)
      });
    };

    const endpoints = await getEndpoints(workspace.id);

    if (!endpoints[0]) {
      return NextResponse.redirect(
        new URL(`/${workspace.slug}/welcome`, req.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/${workspace.slug}/${endpoints[0].slug}`, req.url)
    );
  }
});

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico).*)']
};
