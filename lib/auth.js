import { createClient } from '@/utils/supabase/server';

/**
 * Retrieves the currently authenticated Supabase user from server cookies.
 * Returns { user, error }. If unauthenticated, user will be null.
 * 
 * @returns {Promise<{ user: import('@supabase/supabase-js').User | null, error: any }>}
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, error: error || new Error('No active user session') };
    }

    return { user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
}
