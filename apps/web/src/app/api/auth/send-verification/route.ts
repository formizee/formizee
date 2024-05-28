import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, type } = await request.json();

  const res = await fetch(`${process.env.API_URL}/api/auth/send-verification`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, type }),
    credentials: 'include',
    method: 'POST',
  });

  const verificationHeader = res.headers.get('set-cookie');
  const data = await res.json();

  if (!res.ok || !verificationHeader) {
    const error = {
      name: 'Authentication Error',
      message: data.error
    };
    return NextResponse.json({ data: null, error }, { status: res.status });
  }

  return NextResponse.json(
    { data: { user: data }, error: null },
    { 
      status: res.status,
      headers: {'Set-Cookie': verificationHeader}
    }
  );
}
