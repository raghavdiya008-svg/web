import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    const adminKey = process.env.ADMIN_KEY || process.env.AUTH_SECRET;

    if (!key || !adminKey) {
      return NextResponse.json({ error: 'Key required' }, { status: 400 });
    }

    if (key.trim() !== adminKey.trim()) {
      return NextResponse.json({ error: 'Invalid master key' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    // Set a secure HTTP-only cookie valid for 7 days
    response.cookies.set('editx_admin_token', adminKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
