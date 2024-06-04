import {NextResponse} from 'next/server';

export async function POST(): Promise<NextResponse> {
  if (!process.env.API_URL)
    throw new Error('API_URL enviroment variable is not defined.');

  const res = await fetch(`${process.env.API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    const data = await res.json();
    const error = {
      name: 'Logout Error',
      message: data.error || 'An error occurred during logout'
    };
    return NextResponse.json({error}, {status: res.status});
  }

  return NextResponse.json({error: null}, {status: res.status});
}
