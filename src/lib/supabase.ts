import { createClient } from '@supabase/supabase-js'

export const SB_URL = 'https://nbdwgblwkvirdmbbfmaw.supabase.co'
export const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHdnYmx3a3ZpcmRtYmJmbWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjEyMTEsImV4cCI6MjEwMjEzNzIxMX0.ZlD1rI12N4xu6ra2gwIQb173Y0ygBPBGTblFm-7r09E'
export const SB_SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZHdnYmx3a3ZpcmRtYmJmbWF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjU2MTIxMSwiZXhwIjoyMTAyMTM3MjExfQ.NcnXvrkoQqC0yatSMY-jmTaPbi8i-YqZi8xhFI9x4u8'

export const supabase = createClient(SB_URL, SB_ANON)
export const supabaseAdmin = createClient(SB_URL, SB_SK)

export const isSupabaseConfigured = Boolean(
  SB_URL && SB_ANON && SB_URL.includes('supabase.co')
)
