const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

console.log('================================================================');
console.log('EDITX VAULT // SUPABASE STORAGE & DATABASE PROVISIONING');
console.log('================================================================');

if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseKey || supabaseKey.includes('placeholder')) {
  console.log('\n❌ Supabase credentials not found or currently set to placeholder in .env.local:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || 'MISSING'}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? (supabaseKey.slice(0, 10) + '...') : 'MISSING'}`);
  console.log('\n📋 TO CONNECT SUPABASE:');
  console.log('1. Go to https://supabase.com and create a free project: "EditX-Vault"');
  console.log('2. In your Supabase Dashboard -> Project Settings -> API:');
  console.log('   - Copy "Project URL" -> paste as NEXT_PUBLIC_SUPABASE_URL in .env.local');
  console.log('   - Copy "anon public" key -> paste as NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.log('   - Copy "service_role secret" key -> paste as SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.log('3. In Supabase Dashboard -> SQL Editor, run the file:');
  console.log('   "supabase/migrations/001_initial_schema.sql"');
  console.log('4. Run this script again: node scripts/setup_supabase.js');
  console.log('================================================================\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}...`);

  // 1. Storage Bucket Provisioning
  console.log('\n[1/3] Checking Storage Bucket "assets"...');
  const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
  if (bucketListError) {
    console.error('Error listing buckets:', bucketListError.message);
  } else {
    const assetBucket = buckets.find((b) => b.name === 'assets');
    if (!assetBucket) {
      console.log('Creating private storage bucket "assets"...');
      const { data: created, error: createError } = await supabase.storage.createBucket('assets', {
        public: false, // Private: requires signed URL
      });
      if (createError) {
        console.error('Failed to create bucket:', createError.message);
      } else {
        console.log(' Bucket "assets" created successfully.');
      }
    } else {
      console.log(' Bucket "assets" already exists.');
    }
  }

  // 2. Upload asset files from private-vault-packages
  console.log('\n[2/3] Uploading asset canisters to Supabase Storage...');
  const baseDir = path.join(process.cwd(), 'private-vault-packages');
  if (fs.existsSync(baseDir)) {
    const filesToUpload = [
      {
        local: path.join(baseDir, 'sfx', 'editx-sfx-sub-bass-suite-01.zip'),
        remote: 'drops/editx-sfx-sub-bass-suite-01.zip',
        mime: 'application/zip',
      },
      {
        local: path.join(baseDir, 'luts', 'editx-kodak-5219-cine-lut.zip'),
        remote: 'drops/editx-kodak-5219-cine-lut.zip',
        mime: 'application/zip',
      },
      {
        local: path.join(baseDir, 'motion', 'editx-kinetic-typography-lottie-pack.zip'),
        remote: 'drops/editx-kinetic-typography-lottie-pack.zip',
        mime: 'application/zip',
      },
      {
        local: path.join(baseDir, 'contracts', 'editx-commercial-video-contract-kit.zip'),
        remote: 'drops/editx-commercial-video-contract-kit.zip',
        mime: 'application/zip',
      },
      {
        local: path.join(baseDir, 'grain', 'editx-16mm-film-grain-4k-pack.zip'),
        remote: 'drops/editx-16mm-film-grain-4k-pack.zip',
        mime: 'application/zip',
      },
    ];

    for (const item of filesToUpload) {
      if (fs.existsSync(item.local)) {
        const fileData = fs.readFileSync(item.local);
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(item.remote, fileData, {
            contentType: item.mime,
            upsert: true,
          });

        if (uploadError) {
          console.warn(`  ⚠️  Failed to upload ${item.remote}:`, uploadError.message);
        } else {
          console.log(`  Uploaded ${item.remote} (${(fileData.length / 1024).toFixed(1)} KB)`);
        }
      }
    }
  }

  // 3. Sync Database Drops
  console.log('\n[3/3] Verifying database tables...');
  const { data: categories, error: catError } = await supabase.from('categories').select('id, slug');
  if (catError) {
    console.log('⚠️  Could not query "categories" table:', catError.message);
    console.log('👉 Please execute "supabase/migrations/001_initial_schema.sql" in your Supabase SQL Editor.');
  } else {
    console.log(` Categories table found with ${categories.length} categories.`);
    const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

    const dropsToSeed = [
      {
        slug: 'v-01',
        title: 'Cinematic Sub-Bass & Trailer Impact Suite 01',
        description: 'Analog sub-bass drops, modular brass hits, and acoustic impacts for cinematic trailers. Includes uncompressed stems at 48kHz / 24-bit.',
        category_id: catMap['sfx'] || null,
        file_url: 'drops/editx-sfx-sub-bass-suite-01.zip',
        file_size: 423000,
        file_format: 'wav',
        license: 'MIT',
        tags: ['sfx', 'trailer', 'sub-bass', 'impacts'],
        compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Reaper'],
        scheduled_for: '2026-10-03T14:00:00.000Z',
        is_live: true,
      },
      {
        slug: 'v-02',
        title: 'Kodak 5219 500T Cine Emulation LUT Pack',
        description: 'Accurate 3D CUBE film matrix approximating organic film s-curve and warm density roll-off.',
        category_id: catMap['luts'] || null,
        file_url: 'drops/editx-kodak-5219-cine-lut.zip',
        file_size: 46000,
        file_format: 'cube',
        license: 'CC0',
        tags: ['luts', 'kodak', 'color-grading', 'film-emulation'],
        compatible_software: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro'],
        scheduled_for: '2026-10-04T14:00:00.000Z',
        is_live: false,
      },
      {
        slug: 'v-03',
        title: 'Kinetic 3D Typography Rigs v2',
        description: 'Production Lottie JSON and motion presets for kinetic lower thirds and title cards.',
        category_id: catMap['animations'] || null,
        file_url: 'drops/editx-kinetic-typography-lottie-pack.zip',
        file_size: 24000,
        file_format: 'json',
        license: 'MIT',
        tags: ['motion', 'lottie', 'kinetic-type', 'presets'],
        compatible_software: ['After Effects', 'Premiere Pro', 'LottieFiles'],
        scheduled_for: '2026-10-05T14:00:00.000Z',
        is_live: false,
      },
      {
        slug: 'v-04',
        title: 'Commercial Production Retainer & NDA Kit',
        description: 'Bulletproof production contract specifying kickoff deposits, revision caps, and source file riders.',
        category_id: catMap['contracts'] || null,
        file_url: 'drops/editx-commercial-video-contract-kit.zip',
        file_size: 1850,
        file_format: 'md',
        license: 'MIT',
        tags: ['contracts', 'nda', 'freelance', 'legal'],
        compatible_software: ['Google Docs', 'Microsoft Word', 'Markdown'],
        scheduled_for: '2026-10-02T14:00:00.000Z',
        is_live: true,
      },
      {
        slug: 'v-05',
        title: 'Vintage 16mm Film Grain Overlays 4K',
        description: '4K film grain overlay specifications and blending workflows for analog film texture.',
        category_id: catMap['overlays'] || null,
        file_url: 'drops/editx-16mm-film-grain-4k-pack.zip',
        file_size: 4500,
        file_format: 'txt',
        license: 'MIT',
        tags: ['grain', '16mm', 'overlays', 'texture'],
        compatible_software: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
        scheduled_for: '2026-10-01T14:00:00.000Z',
        is_live: true,
      },
    ];

    for (const drop of dropsToSeed) {
      const { error: dropUpsertError } = await supabase.from('drops').upsert(drop, { onConflict: 'slug' });
      if (dropUpsertError) {
        console.warn(`  ⚠️ Error seeding drop ${drop.title}:`, dropUpsertError.message);
      } else {
        console.log(`   Seeded drop: ${drop.title}`);
      }
    }
    console.log(' All drops synced with database.');
  }

  console.log('\n Supabase synchronization check complete.\n');
}

main().catch(console.error);
