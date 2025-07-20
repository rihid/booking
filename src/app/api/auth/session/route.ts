import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// POST /api/auth/session
// Create a new session with user data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user } = body;

    // Validate user data
    if (!user || typeof user !== 'object') {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Create session using the existing createSession function
    await createSession(user);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Session creation error:', error);
    
    // Handle specific session creation errors
    if (error.message?.includes('Session data too large')) {
      return NextResponse.json(
        { error: 'Session data is too large. Please contact support.' },
        { status: 413 }
      );
    }

    if (error.message?.includes('Failed to create session chunk')) {
      return NextResponse.json(
        { error: 'Failed to store session data. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}