import {database, schema, eq} from '@/lib/db';
import {NextResponse} from 'next/server';
import {auth} from '@/lib/auth';

export default auth(async req => {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (!req.auth && pathname !== '/login') {
    return NextResponse.redirect(
      new URL(
        `/login?redirectTo=${encodeURIComponent(req.nextUrl.href)}`,
        req.url
      )
    );
  }

  if (req.auth?.user?.id && pathname === '/') {
    const allowedWorkspaces = await database
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
      .where(eq(schema.user.id, req.auth.user.id));

    if (allowedWorkspaces.length > 0 && allowedWorkspaces[0]?.workspaces) {
      const firstWorkspace = allowedWorkspaces[0]?.workspaces;
      const {slug} = firstWorkspace;
      return NextResponse.redirect(new URL(`/${slug}`, req.url));
    }
  }

  if (!req.auth && req.cookies.has('workspace-slug')) {
    const response = NextResponse.next();
    response.cookies.delete('workspace-slug');
    return response;
  }
});

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|favicon.ico).*)']
};
