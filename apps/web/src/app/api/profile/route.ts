import {NextResponse} from 'next/server';

export async function GET() {
  const res = await fetch(`${process.env.API_URL}/api/profile`, {
    credentials: 'include',
    method: 'GET'
  });

  const data = await res.json();

  if (!res.ok) {
    const error = {
      name: res.statusText,
      message: data.error
    };
    return NextResponse.json({data: null, error}, {status: res.status});
  }

  return NextResponse.json(
    {data: {user: data}, error: null},
    {status: res.status}
  );
}
