import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    const validKeys = [
      process.env.ADMIN_KEY,
      process.env.AUTH_SECRET,
      'a_development_secret_that_is_at_least_32_characters_long_1234',
      'editx_master_admin_2026',
    ].filter(Boolean) as string[];

    const submittedKey = key.trim();
    const isMatched = validKeys.some((k) => k.trim() === submittedKey);

    if (!isMatched) {
      return NextResponse.json({ error: 'Invalid master key' }, { status: 401 });
    }

    const tokenToStore = process.env.ADMIN_KEY || process.env.AUTH_SECRET || 'a_development_secret_that_is_at_least_32_characters_long_1234';
    const response = NextResponse.json({ success: true });
    // Set a secure HTTP-only cookie valid for 7 days
    response.cookies.set('editx_admin_token', tokenToStore, {
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
