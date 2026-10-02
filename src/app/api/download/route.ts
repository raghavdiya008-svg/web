import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const dropId = request.nextUrl.searchParams.get('dropId');
  if (!dropId) return NextResponse.json({ error: 'dropId required' }, { status: 400 });

  // For mock/local preview assets, return simulated real download
  if (dropId.startsWith('mock') || dropId.startsWith('v-')) {
    const dummyPayload = encodeURIComponent(
      `EDITX VAULT // MASTER ASSET PAYLOAD\nAsset ID: ${dropId}\nTimestamp: ${new Date().toISOString()}\nLicense: MIT / CC-0\nStatus: Verified Master Extraction`
    );
    return NextResponse.json({
      url: `data:text/plain;charset=utf-8,${dummyPayload}`,
      expiresIn: 3600,
      filename: `editx-${dropId}.txt`,
    });
  }

  const supabase = createSupabaseAdminClient();
  const { data: drop, error: dropError } = await supabase
    .from('drops')
    .select('id, file_url, file_size')
    .eq('id', dropId)
    .eq('is_live', true)
    .single();

  if (dropError || !drop) {
    return NextResponse.json({ error: 'Drop not found or not live' }, { status: 404 });
  }

  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from('assets')
    .createSignedUrl(drop.file_url, 60 * 15);

  if (urlError || !signedUrlData?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
  }

  return NextResponse.json({ url: signedUrlData.signedUrl, expiresIn: 900 });
}