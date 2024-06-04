import {type NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {email} = await request.json();

  if (!process.env.API_URL)
    throw new Error('API_URL enviroment variable is not defined.');

  const res = await fetch(`${process.env.API_URL}/api/waitlist/join`, {
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
    method: 'POST'
  });

  const data = await res.json();

  if (!res.ok) {
    const error = {
      name: 'Be Patient...',
      message: data.error
    };
    return NextResponse.json({error}, {status: res.status});
  }

  return NextResponse.json({error: null}, {status: res.status});
}
