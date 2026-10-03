import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url.includes('placeholder') || !url.startsWith('http')) {
    const dummyQuery = () => {
      const builder: any = {
        select: () => builder,
        insert: () => builder,
        update: () => builder,
        upsert: () => builder,
        delete: () => builder,
        eq: () => builder,
        neq: () => builder,
        gt: () => builder,
        gte: () => builder,
        lt: () => builder,
        lte: () => builder,
        like: () => builder,
        ilike: () => builder,
        is: () => builder,
        in: () => builder,
        order: () => builder,
        limit: () => builder,
        range: () => builder,
        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (onfulfilled: any) => Promise.resolve({ data: [], error: null, count: 0 }).then(onfulfilled),
      };
      return builder;
    };

    return {
      from: () => dummyQuery(),
      storage: {
        from: () => ({
          createSignedUrl: () => Promise.resolve({ data: null, error: new Error('Supabase storage not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
      auth: {
        admin: {
          getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
        },
      },
    } as any;
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}