import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

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
    return createClient(supabaseUrl.trim(), supabaseKey.trim(), {
      auth: {
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e.message);
    return null;
  }
})();