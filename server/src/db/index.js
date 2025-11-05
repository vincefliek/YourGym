import { createClient } from '@supabase/supabase-js';

export const initSupabase = () => createClient(
  process.env.DB_URL,
  process.env.DB_KEY
);
