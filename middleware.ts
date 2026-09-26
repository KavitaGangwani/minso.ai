import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'minso_admin_session';
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'minso_admin_session_secret_key_32_characters_minimum!';
const encodedKey = new TextEncoder().encode(SESSION_SECRET);

// Protect /admin sub-routes against unauthenticated access
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect subroutes like /admin/agents, /admin/agents/[id]
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
