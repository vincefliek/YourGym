import { createClient } from '@supabase/supabase-js';

/**
 * Create Supabase client for server usage.
 * Crucial options for server:
 *   - persistSession: false -> don't use browser-like storage
 *   - autoRefreshToken: false -> avoid automatic background refresh
 */
export const initSupabase = () => createClient(
  process.env.DB_URL!,
  process.env.DB_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
