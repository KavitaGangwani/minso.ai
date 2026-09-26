import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.SUPABASE_URL || 'https://placeholder.supabase.co').trim().replace(/^['"]|['"]$/g, '');
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key').trim().replace(/^['"]|['"]$/g, '');

if (!process.env.SUPABASE_URL) {
  console.warn('[Supabase] Warning: SUPABASE_URL environment variable is not set.');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[Supabase] Warning: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
}

// Global server-side client with admin/service-role access for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
