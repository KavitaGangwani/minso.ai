import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'minso_admin_session';

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'minso_admin_session_secret_key_32_characters_minimum!';
const encodedKey = new TextEncoder().encode(SESSION_SECRET);

// Issue a signed JWT session cookie for 7 days
export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
}

// Verify a given JWT session token
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return true;
  } catch {
    return false;
  }
}

// Check if the current request has a valid admin session
export async function getSession(): Promise<boolean> {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(cookie);
}

// Invalidate and delete the session cookie
export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
