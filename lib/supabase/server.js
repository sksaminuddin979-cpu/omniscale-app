import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing in server context!', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    })
  }

  return createServerClient(
    supabaseUrl || 'https://missing-config.supabase.co',
    supabaseAnonKey || 'missing-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Server Component error during cookie setting is expected sometimes
          }
        },
      },
    }
  )
}