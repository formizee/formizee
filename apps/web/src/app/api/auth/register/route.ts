import {type NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {name, email, password} = await request.json();

  if (!process.env.API_URL)
    throw new Error('API_URL enviroment variable is not defined.');

  const res = await fetch(`${process.env.API_URL}/api/auth/register`, {
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email, password}),
    credentials: 'include',
    method: 'POST'
  });

  const cookieHeader = res.headers.get('set-cookie');
  const data = await res.json();

  if (!res.ok) {
    const error = {
      name: 'Authentication Error',
      message: data.error
    };
    return NextResponse.json({error}, {status: res.status});
  }

  if (!cookieHeader) {
    const error = {
      name: 'Authentication Error',
      message: 'No session found, Please try later.'
    };
    return NextResponse.json({data: null, error}, {status: res.status});
  }

  return NextResponse.json(
    {error: null},
    {
      status: res.status,
      headers: {'Set-Cookie': cookieHeader}
    }
  );
}
