import { useState, useEffect } from 'react'
import { Testimonial } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author_name: 'Mariana Silva',
    pet_name: 'Luna (Golden Retriever)',
    content: 'Atendimento humanizado e extremamente rápido no momento da urgência da Luna. A equipe médica foi incrível, precisa no diagnóstico e deu todo o suporte que precisávamos. Gratidão eterna à IDDA!',
    rating: 5,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't2',
    author_name: 'Carlos Eduardo',
    pet_name: 'Thor (Vira-Lata / SRD)',
    content: 'Estrutura excelente! Levei o Thor para exames de rotina e vacinação. Ambiente extremamente limpo, sem estresse para os animais e profissionais muito atenciosos.',
    rating: 5,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't3',
    author_name: 'Ana Beatriz',
    pet_name: 'Oliver (Gato Persa)',
    content: 'Meu gatinho costuma ficar apavorado em clínicas, mas na IDDA Veterinária eles têm um cuidado especial no manejo gatuno. Ele ficou super tranquilo durante toda a consulta.',
    rating: 5,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 't4',
    author_name: 'Roberto & Patrícia',
    pet_name: 'Belinha (Poodle 12 anos)',
    content: 'Acompanhamento geriátrico fantástico. Dra. e especialistas muito competentes no tratamento de cardiologia e ortopedia. A Belinha ganhou nova qualidade de vida!',
    rating: 5,
    active: true,
    created_at: new Date().toISOString()
  }
]

const LOCAL_STORAGE_KEY = 'idda_testimonials_data'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data && data.length > 0) {
          setTestimonials(data)
          setLoading(false)
          return
        }
      } catch (err: any) {
        console.warn('Supabase fetch failed for testimonials, falling back to local storage:', err.message)
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setTestimonials(JSON.parse(saved))
      } catch {
        setTestimonials(INITIAL_TESTIMONIALS)
      }
    } else {
      setTestimonials(INITIAL_TESTIMONIALS)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TESTIMONIALS))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const saveTestimonialsLocally = (newList: Testimonial[]) => {
    setTestimonials(newList)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList))
  }

  const addTestimonial = async (item: Omit<Testimonial, 'id' | 'created_at'>) => {
    const newId = 't_' + Date.now()
    const newTestimonial: Testimonial = {
      ...item,
      id: newId,
      created_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([item])
          .select()
        if (!error && data && data[0]) {
          await fetchTestimonials()
          return data[0]
        }
      } catch (err) {
        console.warn('Supabase testimonial insert failed, using local mode', err)
      }
    }

    const updated = [newTestimonial, ...testimonials]
    saveTestimonialsLocally(updated)
    return newTestimonial
  }

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .update(updates)
          .eq('id', id)
        if (!error) {
          await fetchTestimonials()
          return
        }
      } catch (err) {
        console.warn('Supabase testimonial update failed, using local mode', err)
      }
    }

    const updated = testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
    saveTestimonialsLocally(updated)
  }

  const deleteTestimonial = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id)
        if (!error) {
          await fetchTestimonials()
          return
        }
      } catch (err) {
        console.warn('Supabase testimonial delete failed, using local mode', err)
      }
    }

    const updated = testimonials.filter(t => t.id !== id)
    saveTestimonialsLocally(updated)
  }

  return {
    testimonials,
    loading,
    error,
    refreshTestimonials: fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  }
}
