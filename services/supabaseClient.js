import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Supabase client will not be initialized correctly.");
}

export const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
            persistSession: true,
            autoRefreshToken: true,
        }
    })
    : null;