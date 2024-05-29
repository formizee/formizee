import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  const res = await fetch(`${process.env.API_URL}/api/auth/register`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
    method: 'POST',
  });

  const verificationHeader = res.headers.get('set-cookie');
  const data = await res.json();

  if (!res.ok || !verificationHeader) {
    const error = {
      name: 'Authentication Error',
      message: data.error ?? "Verification data not found, Please try later."
    };
    return NextResponse.json({ error }, { status: res.status });
  }

  return NextResponse.json(
    { error: null },
    {
      status: res.status,
      headers: { 'Set-Cookie': verificationHeader }
    }
  );
}
