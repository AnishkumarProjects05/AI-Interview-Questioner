import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database

const supabaseUrl= process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(
    supabaseUrl, 
    supabaseKey,
    {
        auth: {
            storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
            persistSession: true, // Use sessionStorage but keep it persistent across refreshes
            autoRefreshToken: true,
        }
    }
)