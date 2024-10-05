// This check can be removed
// it is just for tutorial purposes

export const hasEnvVars =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_ANON_KEY;
