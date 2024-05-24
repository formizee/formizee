import type {NextRequest} from 'next/server';

export function middleware (request: NextRequest) {
  const currentSession = request.cookies.get('session')?.value;

  if (currentSession && request.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/dashboard', request.url))
  }

  if (currentSession && request.nextUrl.pathname.startsWith('/register')) {
    return Response.redirect(new URL('/dashboard', request.url))
  }
 
  if (!currentSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
