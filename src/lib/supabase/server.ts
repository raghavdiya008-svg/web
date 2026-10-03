import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder') || !url.startsWith('http')) {
    // Return safe no-op mock client to prevent server crash when env vars are not yet configured on Vercel
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
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any;
  }

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // Ignore in server component
        }
      },
    },
  });
}