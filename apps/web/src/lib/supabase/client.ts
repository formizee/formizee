import {createBrowserClient as _createBrowserClient} from '@supabase/ssr';
import type {SupabaseClient} from '@supabase/supabase-js';

export const createBrowserClient = (): SupabaseClient => {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'null',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'null'
  );
};
