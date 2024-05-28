import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const session = cookies().get('session');
  const { password } = await request.json();

  if(!session?.value) {
    const error = {
      name: "Authentication Error",
      message: "Invalid session, please login first."
    }
    return NextResponse.json({ data: null, error }, { status: 400 });
  }

  const res = await fetch(`${process.env.API_URL}/api/profile/password`, {
    headers: { 
      Cookie: `${session.name}=${session.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password }),
    credentials: 'include',
    method: 'PUT',
  });

  const data = await res.json();

  if (!res.ok) {
    const error = {
      name: res.statusText,
      message: data.error
    };
    return NextResponse.json({ error }, { status: res.status });
  }

  return NextResponse.json({ error: null }, { status: res.status }
  );
}
