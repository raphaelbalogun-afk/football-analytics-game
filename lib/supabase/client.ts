import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for browser/client-side operations
 * Used in React components that run in the browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

