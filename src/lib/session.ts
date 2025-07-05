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

// export async function createSession(user: any) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const session = await encrypt({ user, expiresAt })
//   cookies().set('session', session, {
//     httpOnly: false,
//     secure: env === 'staging'? false : true,
//     expires: expiresAt,
//     sameSite: 'lax',
//     path: '/',
//   })
// }
// export async function getSession() {
//   const session = cookies().get("session")?.value;
//   if (!session) return null;
//   return await decrypt(session);
// }
// export async function updateSession() {
//   const session = cookies().get('session')?.value
//   const payload = await decrypt(session as string)
 
//   if (!session || !payload) {
//     return null
//   }
 
//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//   cookies().set('session', session, {
//     httpOnly: false,
//     secure: env === 'staging'? false : true,
//     expires: expires,
//     sameSite: 'lax',
//     path: '/',
//   })
// }
// export function deleteSession() {
//   cookies().delete('session')
// }

const MAX_COOKIE_SIZE = 3800; // bytes, buffer for metadata

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

// Untuk membaca dan menggabungkan kembali:
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

// Untuk menghapus semua chunk:
export function deleteSession() {
  let idx = 0;
  while (true) {
    const key = `session.${idx}`;
    if (!cookies().get(key)) break;
    cookies().delete(key);
    idx++;
  }
}