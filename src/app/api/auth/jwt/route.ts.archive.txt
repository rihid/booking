import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (session) {
      // @ts-ignore
      return NextResponse.json(session);
    } else {
      return NextResponse.json({ error: 'Session not found' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
