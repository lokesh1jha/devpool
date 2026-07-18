import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasEnvVars = Boolean(supabaseUrl && supabaseAnonKey);

// Only create the client when env vars are present
// Components must check hasEnvVars before calling supabase methods
export const supabase: SupabaseClient = hasEnvVars
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient);
