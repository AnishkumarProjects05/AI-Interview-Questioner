import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '').trim();
};

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method can be called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
