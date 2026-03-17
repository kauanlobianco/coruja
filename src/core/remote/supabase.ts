import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null | undefined

export function getSupabaseClient() {
  if (cachedClient !== undefined) {
    return cachedClient
  }

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    cachedClient = null
    return cachedClient
  }

  cachedClient = createClient(url, anonKey)
  return cachedClient
}

export function hasSupabaseEnv() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}
