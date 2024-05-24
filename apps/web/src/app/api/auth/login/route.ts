import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const {email, password} = await request.json();

  const res = await fetch(
    `${process.env.API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({email, password}),
  })

  const sessionHeader = res.headers.get('set-cookie');
  const data = await res.json()

  if (!res.ok || !sessionHeader) {
    const error = {
      name: "Authentication Error",
      message: data.error
    }
    return NextResponse.json({data: null, error}, { status: res.status })
  }

  return NextResponse.json({data: {user: data}, error: null}, {
    status: res.status,
    headers: {'Set-Cookie': sessionHeader}
  });
}
