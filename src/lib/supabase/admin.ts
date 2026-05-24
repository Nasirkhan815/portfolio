import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the private service role key.
 * WARNING: This client bypasses Row Level Security (RLS) policies completely.
 * ONLY use this client on the server side (Server Actions, Route Handlers, or Server Components)
 * for administrative tasks that cannot be performed under the user's regular privileges.
 * NEVER import or invoke this in client-side code.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase administrative credentials. Check that NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
