import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/env'
import { Database } from '@/types/database.types'

export function createClient(): SupabaseClient<any> {
    return createBrowserClient<any>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
}
