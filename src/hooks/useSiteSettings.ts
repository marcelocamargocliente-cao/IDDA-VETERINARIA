import { useState, useEffect, useCallback } from 'react'
import { SiteSetting } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  location_image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80',
  hero_image: 'https://nbdwgblwkvirdmbbfmaw.supabase.co/storage/v1/object/public/idda-photos/fachada.jpg',
  gallery_featured: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
}

const LOCAL_STORAGE_KEY = 'idda_site_settings_data'

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)

    let loadedSettings: Record<string, string> = { ...DEFAULT_SITE_SETTINGS }

    // First try localStorage
    const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal)
        loadedSettings = { ...loadedSettings, ...parsed }
      } catch {
        // keep defaults
      }
    }

    // Next try Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

        if (error) {
          console.warn('Supabase site_settings table not found or query error:', error.message)
        } else if (data && data.length > 0) {
          data.forEach((item: SiteSetting) => {
            if (item.key && item.value) {
              loadedSettings[item.key] = item.value
            }
          })
        }
      } catch (err: any) {
        console.warn('Supabase fetch failed for site_settings:', err.message)
      }
    }

    setSettings(loadedSettings)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedSettings))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const getSetting = useCallback(
    (key: string, defaultValue?: string): string => {
      return settings[key] || defaultValue || DEFAULT_SITE_SETTINGS[key] || ''
    },
    [settings]
  )

  const updateSetting = async (
    key: string,
    value: string,
    description?: string
  ): Promise<boolean> => {
    try {
      const updated = { ...settings, [key]: value }
      setSettings(updated)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))

      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase
            .from('site_settings')
            .upsert(
              {
                key,
                value,
                description: description || `Configuração para ${key}`,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'key' }
            )

          if (error) {
            console.warn('Erro ao atualizar site_settings no Supabase (salvo localmente):', error.message)
          }
        } catch (err: any) {
          console.warn('Falha na requisição Supabase site_settings:', err.message)
        }
      }

      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const uploadSettingImage = async (
    blobOrFile: Blob | File,
    key: string
  ): Promise<string | null> => {
    if (isSupabaseConfigured) {
      try {
        const ext = 'jpg'
        const fileName = `setting-${key}-${Date.now()}.${ext}`
        const fileToUpload =
          blobOrFile instanceof File
            ? blobOrFile
            : new File([blobOrFile], fileName, { type: 'image/jpeg' })

        const { data, error } = await supabase.storage
          .from('idda-photos')
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: true
          })

        if (error) {
          console.warn('Upload no storage idda-photos falhou, convertendo em DataURL:', error.message)
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from('idda-photos')
            .getPublicUrl(data.path)

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl
          }
        }
      } catch (err: any) {
        console.warn('Erro durante upload de imagem para setting:', err.message)
      }
    }

    // Local fallback: convert Blob to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        resolve(null)
      }
      reader.readAsDataURL(blobOrFile)
    })
  }

  return {
    settings,
    loading,
    error,
    getSetting,
    updateSetting,
    uploadSettingImage,
    refetch: fetchSettings
  }
}
