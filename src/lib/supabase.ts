import { createClient } from '@supabase/supabase-js'

const defaultUrl = 'https://nbdwgblwkvirdmbbfmaw.supabase.co'
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHdnYmx3a3ZpcmRtYmJmbWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDUyNjAsImV4cCI6MjA2ODI4MTI2MH0.OJvvzM5CrXGJaOHDXHoqcaAZU9xVEZJqRJdh65_g0kY'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey &&
  supabaseUrl !== 'sua_url_aqui' &&
  supabaseUrl !== '' &&
  supabaseUrl.includes('supabase.co')
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

