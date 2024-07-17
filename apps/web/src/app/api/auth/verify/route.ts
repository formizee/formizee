import {cookies} from 'next/headers';
import {type NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const verification = cookies().get('verification');
  const {token} = await request.json();

  if (!verification?.value) {
    const error = {
      name: 'Authentication Error',
      message: 'Verification cookies are empty'
    };
    return NextResponse.json({data: null, error}, {status: 400});
  }

  const res = await fetch(`${process.env.API_URL}/api/auth/verify`, {
    headers: {
      Cookie: `${verification.name}=${verification.value};path=/;expires=Session`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token}),
    credentials: 'include',
    method: 'POST'
  });

  const sessionHeader = res.headers.get('set-cookie');
  const data = await res.json();

  if (!res.ok || !sessionHeader) {
    const error = {
      name: 'Authentication Error',
      message: data.error ?? 'Session not found.'
    };
    return NextResponse.json({data: null, error}, {status: res.status});
  }

  return NextResponse.json(
    {data, error: null},
    {status: res.status, headers: {'Set-Cookie': sessionHeader}}
  );
}
