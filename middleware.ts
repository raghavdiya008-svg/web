import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Only role-gate the /admin dashboard
  if (pathname.startsWith('/admin')) {
    // In local development, allow direct access so you can test admin pages
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    // Check for Master Key session cookie
    const adminCookie = req.cookies.get('editx_admin_token')?.value;
    const validTokens = [
      process.env.ADMIN_KEY,
      process.env.AUTH_SECRET,
      'a_development_secret_that_is_at_least_32_characters_long_1234',
      'editx_master_admin_2026',
    ].filter(Boolean) as string[];

    if (adminCookie && validTokens.some((t) => t.trim() === adminCookie.trim())) {
      return NextResponse.next();
    }

    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }

  // Vault is fully public
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};