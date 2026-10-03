import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';
import { auth } from '@/lib/auth/config';
import fs from 'fs';
import path from 'path';

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
  if (!dropId) return NextResponse.json({ error: 'dropId parameter required' }, { status: 400 });

  const resolvedId = LEGACY_ID_MAP[dropId] || dropId;
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  // =========================================================================
  // 1. PRODUCTION MODE: SUPABASE CLOUD STORAGE & DATABASE
  // =========================================================================
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseAdminClient();
      if (supabase) {
        // Query drop from database
        const { data: drop, error: dropError } = await supabase
          .from('drops')
          .select('id, title, file_url, file_size, file_format, is_live, scheduled_for, download_count')
          .or(`id.eq.${resolvedId},slug.eq.${resolvedId}`)
          .single();

        if (drop && !dropError) {
          // Check if canister is locked
          const isScheduledFuture = new Date(drop.scheduled_for) > new Date();
          if (!drop.is_live && isScheduledFuture) {
            return NextResponse.json(
              { error: 'Canister is sealed until scheduled drop time.' },
              { status: 403 }
            );
          }

          // Generate expiring signed URL from Supabase Storage (15 minutes)
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from('assets')
            .createSignedUrl(drop.file_url, 60 * 15);

          if (!urlError && signedUrlData?.signedUrl) {
            // Asynchronously increment download counter
            supabase
              .from('drops')
              .update({ download_count: (drop.download_count || 0) + 1 })
              .eq('id', drop.id)
              .then(() => {})
              .catch(() => {});

            // Record download log if session exists
            auth()
              .then((session) => {
                if (session?.user?.id) {
                  supabase
                    .from('downloads')
                    .insert({
                      drop_id: drop.id,
                      user_id: session.user.id,
                      user_agent: request.headers.get('user-agent'),
                    })
                    .then(() => {});
                }
              })
              .catch(() => {});

            return NextResponse.json({
              url: signedUrlData.signedUrl,
              filename: `${drop.title}.${drop.file_format || 'zip'}`,
              expiresIn: 900,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Supabase download error, checking local fallback:', err);
    }
  }

  // =========================================================================
  // 2. OFFLINE / DEVELOPMENT FALLBACK: LOCAL CATALOG & DISK STORAGE
  // =========================================================================
  const catalogMatch = EDITX_VAULT_CATALOG.find((item) => item.id === resolvedId);

  if (catalogMatch) {
    if (!catalogMatch.is_live && new Date(catalogMatch.scheduled_for) > new Date()) {
      return NextResponse.json(
        { error: 'Access denied: Canister is currently sealed.' },
        { status: 403 }
      );
    }

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
      // In cloud serverless (like Vercel) without local disk files, return informative message
      return NextResponse.json(
        {
          error:
            'Asset file not found in local disk. Connect Supabase Storage to download cloud assets.',
        },
        { status: 404 }
      );
    }
  }

  return NextResponse.json({ error: 'Asset canister not found.' }, { status: 404 });
}