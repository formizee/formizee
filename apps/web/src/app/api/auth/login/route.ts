import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const {email, password} = await request.json();

  const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({email, password})
  });

  const cookieHeader = res.headers.get('set-cookie');
  const data = await res.json();
  let user = data;

  if (res.status === 403) {
    user = null;
  }

  if(!res.ok && res.status !== 403) {
    const error = {
      name: "Authentication Error",
      message: data.error
    }

    return NextResponse.json(
      {
        data: {user},
        error: error
      },
      {
        status: res.status,
        headers: cookieHeader ? {'Set-Cookie': cookieHeader} : {}
      }
    );
  }

  return NextResponse.json(
    {
      data: {user},
      error: null
    },
    {
      status: res.status,
      headers: cookieHeader ? {'Set-Cookie': cookieHeader} : {}
    }
  );
}
