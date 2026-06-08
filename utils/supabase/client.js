import { createBrowserClient } from '@supabase/ssr'

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '').trim();
};

export function createClient() {
  const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createBrowserClient(supabaseUrl, supabaseKey);
}
