import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing in browser context!', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    })
  }

  return createBrowserClient(
    supabaseUrl || 'https://missing-config.supabase.co',
    supabaseAnonKey || 'missing-key'
  )
}