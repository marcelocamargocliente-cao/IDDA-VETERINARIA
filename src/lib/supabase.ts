import { createClient } from '@supabase/supabase-js'

export const SB_URL = 'https://nbdwgblwkvirdmbbfmaw.supabase.co'
export const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHdnYmx3a3ZpcmRtYmJmbWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDUyNjAsImV4cCI6MjA2ODI4MTI2MH0.OJvvzM5CrXGJaOHDXHoqcaAZU9xVEZJqRJdh65_g0kY'
export const SB_SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHdnYmx3a3ZpcmRtYmJmbWF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjcwNTI2MCwiZXhwIjoyMDY4MjgxMjYwfQ.8nKhBl7wbOV_WxLEJX2w8V3dTPB3TRpxNDKJlNF7sVo'

export const supabase = createClient(SB_URL, SB_ANON)
export const supabaseAdmin = createClient(SB_URL, SB_SK)

export const isSupabaseConfigured = Boolean(
  SB_URL && SB_ANON && SB_URL.includes('supabase.co')
)
