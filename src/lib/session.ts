import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
 
const secretKey = process.env.SESSION_SECRET
const env = process.env.APP_ENV
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
/*
  const MAX_COOKIE_SIZE = 3800;

  export async function createSession(user: any) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ user, expiresAt });
    // Chunking
    const chunks = [];
    for (let i = 0; i < session.length; i += MAX_COOKIE_SIZE) {
      chunks.push(session.slice(i, i + MAX_COOKIE_SIZE));
    }

    chunks.forEach((chunk, idx) => {
      cookies().set(`session.${idx}`, chunk, {
        httpOnly: false,
        secure: env === 'staging' ? false : true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });
    });
  }
*/ 
const MAX_COOKIE_SIZE = 3500;
export async function createSession(user: any) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  try {
    deleteSession();
    
    const session = await encrypt({ user, expiresAt });
    console.log('Session size:', session.length);
    
    if (session.length > MAX_COOKIE_SIZE * 10) { // Max 10 chunks
      console.warn('Session data is very large:', session.length, 'bytes');
      throw new Error('Session data too large. Please contact support.');
    }
    
    const chunks = [];
    for (let i = 0; i < session.length; i += MAX_COOKIE_SIZE) {
      chunks.push(session.slice(i, i + MAX_COOKIE_SIZE));
    }

    console.log('Creating', chunks.length, 'session chunks');

    chunks.forEach((chunk, idx) => {
      try {
        cookies().set(`session.${idx}`, chunk, {
          httpOnly: false,
          secure: env === 'staging' ? false : true,
          expires: expiresAt,
          sameSite: 'lax',
          path: '/',
        });
      } catch (error) {
        console.error(`Failed to set session chunk ${idx}:`, error);
        throw new Error(`Failed to create session chunk ${idx}`);
      }
    });
    
    console.log('Session created successfully with', chunks.length, 'chunks');
  } catch (error) {
    console.error('Failed to create session:', error);
    // Clean up any partial chunks on failure
    deleteSession();
    throw error;
  }
}

export async function getSession() {
  let session = '';
  let idx = 0;
  while (true) {
    const part = cookies().get(`session.${idx}`)?.value;
    if (!part) break;
    session += part;
    idx++;
  }
  if (!session) return null;
  return await decrypt(session);
}

export function deleteSession() {
  let idx = 0;
  while (true) {
    const key = `session.${idx}`;
    if (!cookies().get(key)) break;
    cookies().delete(key);
    idx++;
  }
}