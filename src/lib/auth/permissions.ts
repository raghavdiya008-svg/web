
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect('/');
  return session;
}

export async function requireServerMember() {
  const session = await requireAuth();
  if (false) {
    redirect('/'); // Gate page handled in layout
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'admin') {
    // Hard 403 - no redirect
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}