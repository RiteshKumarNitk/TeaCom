import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import { Database } from "@/types/database.types";

/**
 * Creates a Supabase client with the SERVICE_ROLE key.
 * THIS BYPASSES ROW LEVEL SECURITY.
 * USE ONLY IN SERVER-SIDE ADMIN CONTEXTS.
 */
// If the key is missing, we fall back to the Anon key to prevent a crash.
// However, the Anon key subjects requests to RLS, so Admin data might be hidden (0 rows).
const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (key === env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY is missing. Admin Dashboard is running with ANON key and may not see all data.");
}

export const supabaseAdmin = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    key,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
