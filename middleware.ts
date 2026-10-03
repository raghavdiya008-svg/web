import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Only role-gate the /admin dashboard
  if (pathname.startsWith('/admin')) {
    // Always allow the admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // In local development, allow direct access so you can test admin pages
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    // Check for Master Key session cookie
    const adminCookie = req.cookies.get('editx_admin_token')?.value;
    const adminKey = process.env.ADMIN_KEY || process.env.AUTH_SECRET;
    if (adminCookie && adminKey && adminCookie === adminKey) {
      return NextResponse.next();
    }

    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Vault is fully public
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};