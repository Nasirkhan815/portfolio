import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sbmumbxekiveqlfgfzyb.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibXVtYnhla2l2ZXFsZmdmenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDkzNzMsImV4cCI6MjA5NTEyNTM3M30.RB9ysShA2m2HmCUVAJF2zl6sGRLdJmEWNEhootXELEA";

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
