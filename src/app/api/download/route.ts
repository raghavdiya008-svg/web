import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';
import fs from 'fs';
import path from 'path';

// Map legacy IDs to verified clean studio canisters
const LEGACY_ID_MAP: Record<string, string> = {
  'mock-1': 'v-01',
  'mock-today': 'v-01',
  'mock-2': 'v-02',
  'mock-3': 'v-03',
  'mock-4': 'v-04',
  'mock-5': 'v-02',
  'mock-6': 'v-05',
  'mock-7': 'v-01',
  'mock-8': 'v-03',
  'mock-9': 'v-02',
  'mock-10': 'v-01',
  'mock-11': 'v-05',
  'mock-12': 'v-04',
};

export async function GET(request: NextRequest) {
  const dropId = request.nextUrl.searchParams.get('dropId');
  if (!dropId) return NextResponse.json({ error: 'dropId required' }, { status: 400 });

  // Map legacy mock IDs to current valid IDs
  const resolvedId = LEGACY_ID_MAP[dropId] || dropId;

  // 1. Direct match in local catalog
  const catalogMatch = EDITX_VAULT_CATALOG.find((item) => item.id === resolvedId);
  
  if (catalogMatch) {
    if (!catalogMatch.is_live && new Date(catalogMatch.scheduled_for) > new Date()) {
      return NextResponse.json({ error: 'Access denied: Canister is currently sealed.' }, { status: 403 });
    }

    // Serve from private directory
    const filePath = path.join(process.cwd(), catalogMatch.package_path);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const filename = catalogMatch.package_path.split('/').pop() || 'download.zip';
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': 'application/zip',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    } else {
      return NextResponse.json({ error: 'Asset file missing from vault storage.' }, { status: 500 });
    }
  }

  // 2. Fallback to Supabase Storage if running in Cloud Production
  try {
    const supabase = createSupabaseAdminClient();
    if (supabase) {
      const { data: drop, error: dropError } = await supabase
        .from('drops')
        .select('id, file_url, file_size')
        .eq('id', resolvedId)
        .eq('is_live', true)
        .single();

      if (!dropError && drop) {
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('assets')
          .createSignedUrl(drop.file_url, 60 * 15);

        if (!urlError && signedUrlData?.signedUrl) {
          return NextResponse.json({ url: signedUrlData.signedUrl, expiresIn: 900 });
        }
      }
    }
  } catch (err) {
    console.warn('Supabase signed URL fallback notice:', err);
  }

  // If not found in catalog or database, explicitly return 404
  return NextResponse.json({ error: 'Drop canister not found or invalid.' }, { status: 404 });
}