import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  type CookieToSet = { name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] };

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Server Components cannot always write refreshed cookies; middleware handles refresh.
          }
        });
      },
    },
  });
}

export function createSupabaseAdminClient() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin Supabase operations.');
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
