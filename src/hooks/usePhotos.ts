import { useState, useEffect } from 'react'
import { Photo } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80',
    caption: 'Atendimento carinhoso e humanizado para cães e gatos',
    category: 'hero',
    order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80',
    caption: 'Consultório moderno e equipado para exames clínicos completos',
    category: 'gallery',
    order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    caption: 'Equipe de especialistas dedicados ao bem-estar do seu pet',
    category: 'gallery',
    order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ambiente acolhedor e seguro com recepção climatizada',
    category: 'gallery',
    order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Bloco cirúrgico equipado com tecnologia de ponta',
    category: 'service',
    order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    url: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sessão de ultrassonografia e diagnósticos por imagem',
    category: 'service',
    order: 6,
    created_at: new Date().toISOString()
  }
]

const LOCAL_STORAGE_KEY = 'idda_photos_data'

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = async () => {
    setLoading(true)
    setError(null)

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setPhotos(data)
          setLoading(false)
          return
        }
      } catch (err: any) {
        console.warn('Supabase fetch failed for photos, falling back to local storage:', err.message)
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setPhotos(JSON.parse(saved))
      } catch {
        setPhotos(INITIAL_PHOTOS)
      }
    } else {
      setPhotos(INITIAL_PHOTOS)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const savePhotosLocally = (newList: Photo[]) => {
    setPhotos(newList)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList))
  }

  const addPhoto = async (photo: Omit<Photo, 'id' | 'created_at'>) => {
    const newId = 'p_' + Date.now()
    const newPhoto: Photo = {
      ...photo,
      id: newId,
      created_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('photos')
          .insert([photo])
          .select()
        if (!error && data && data[0]) {
          await fetchPhotos()
          return data[0]
        }
      } catch (err) {
        console.warn('Supabase photo insert failed, using local mode', err)
      }
    }

    const updated = [...photos, newPhoto]
    savePhotosLocally(updated)
    return newPhoto
  }

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('photos')
          .update(updates)
          .eq('id', id)
        if (!error) {
          await fetchPhotos()
          return
        }
      } catch (err) {
        console.warn('Supabase photo update failed, using local mode', err)
      }
    }

    const updated = photos.map(p => p.id === id ? { ...p, ...updates } : p)
    savePhotosLocally(updated)
  }

  const deletePhoto = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('photos')
          .delete()
          .eq('id', id)
        if (!error) {
          await fetchPhotos()
          return
        }
      } catch (err) {
        console.warn('Supabase photo delete failed, using local mode', err)
      }
    }

    const updated = photos.filter(p => p.id !== id)
    savePhotosLocally(updated)
  }

  return {
    photos,
    loading,
    error,
    refreshPhotos: fetchPhotos,
    addPhoto,
    updatePhoto,
    deletePhoto
  }
}
