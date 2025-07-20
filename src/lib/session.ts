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