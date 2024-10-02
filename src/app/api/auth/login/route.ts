import { NextResponse } from 'next/server';
import { getUserToken } from '@/lib/data';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }

  try {
    const user = await getUserToken(token);
    user.token = token;
    await createSession(user)
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
