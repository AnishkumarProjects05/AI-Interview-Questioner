import { createBrowserClient } from '@supabase/ssr'


const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '').trim();
};

const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Robust check: ensure URL is present and starts with http/https
const isValidUrl = supabaseUrl && (typeof supabaseUrl === 'string') && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));

if (!isValidUrl || !supabaseKey) {
  console.warn("Supabase credentials missing or invalid. Supabase client will not be initialized correctly.");
}

export const supabase = (() => {
  if (!isValidUrl || !supabaseKey) {
    return null;
  }
  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e.message);
    return null;
  }
})();