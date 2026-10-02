import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  try {
    const { data: dueDrops, error } = await supabase
      .from('drops')
      .select('id, title, file_url, categories(name)')
      .eq('is_live', false)
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    if (!dueDrops?.length) return NextResponse.json({ message: 'No drops due', timestamp: now });

    for (const drop of dueDrops) {
      await supabase.from('drops').update({ is_live: true }).eq('id', drop.id);
    }
    return NextResponse.json({ published: dueDrops.length, timestamp: now });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}