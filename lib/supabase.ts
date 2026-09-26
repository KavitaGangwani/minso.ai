import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co'
).trim().replace(/^['"]|['"]$/g, '');

const supabaseServiceRoleKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'placeholder-key'
).trim().replace(/^['"]|['"]$/g, '');

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[Supabase] Warning: Neither SUPABASE_URL nor NEXT_PUBLIC_SUPABASE_URL is set in environment.');
}

// Global server-side client with admin/service-role access for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
