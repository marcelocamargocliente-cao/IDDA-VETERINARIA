import { useState, useEffect } from 'react'
import { Service } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Atendimento de Urgência & Emergência',
    description: 'Pronto atendimento estruturado para casos críticos, traumas, exames rápidos e estabilização imediata.',
    image_url: 'https://images.unsplash.com/photo-1587300411515-65a60b8acf36?w=800&h=600&fit=crop',
    icon: 'ShieldAlert',
    highlight: '24 Horas',
    active: true,
    order: 1
  },
  {
    id: 's2',
    title: 'Consultas Clínicas Especializadas',
    description: 'Acompanhamento preventivo e tratamentos em Dermatologia, Cardiologia, Oftalmologia, Nefrologia e Oncologia.',
    image_url: 'https://images.unsplash.com/photo-1516738901601-4c0a165b8e35?w=800&h=600&fit=crop',
    icon: 'Stethoscope',
    highlight: 'Especialistas',
    active: true,
    order: 2
  },
  {
    id: 's3',
    title: 'Cirurgias Geral e Ortopédica',
    description: 'Bloco cirúrgico moderno equipado com anestesia inalatória, monitorização multiparamétrica e UTI pós-operatória.',
    image_url: 'https://images.unsplash.com/photo-1631217314830-e1ee96e2c07d?w=800&h=600&fit=crop',
    icon: 'Activity',
    highlight: 'Bloco Cirúrgico',
    active: true,
    order: 3
  },
  {
    id: 's4',
    title: 'Vacinação & Imunização',
    description: 'Protocolos de vacinação essenciais e importados para cães e gatos, garantindo máxima imunidade e proteção.',
    image_url: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop',
    icon: 'ShieldCheck',
    highlight: 'Prevenção',
    active: true,
    order: 4
  },
  {
    id: 's5',
    title: 'Exames Laboratoriais & Raio-X',
    description: 'Laboratório próprio e diagnóstico por imagem digital para resultados rápidos e confiáveis no mesmo dia.',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    icon: 'Microscope',
    highlight: 'Diagnóstico Ágil',
    active: true,
    order: 5
  },

]

const DEFAULT_SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1587300411515-65a60b8acf36?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516738901601-4c0a165b8e35?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1631217314830-e1ee96e2c07d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop',
]

function normalizeServices(rawList: any[]): Service[] {
  return rawList.map((s, idx) => ({
    id: s.id?.toString() || `s_${idx + 1}`,
    title: s.title || '',
    description: s.description || '',
    icon: s.icon || 'Stethoscope',
    image_url: s.image_url || s.image || DEFAULT_SERVICE_IMAGES[idx % DEFAULT_SERVICE_IMAGES.length],
    highlight: s.highlight || '',
    link: s.link || '',
    active: s.active !== undefined ? s.active : true,
    order: Number(s.order ?? s.order_display ?? (idx + 1))
  }))
}

const LOCAL_STORAGE_KEY = 'idda_services_data'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    
    if (isSupabaseConfigured) {
      try {
        const { data, error: sbError } = await supabase
          .from('services')
          .select('*')

        if (!sbError && data && data.length > 0) {
          const sorted = data.sort((a, b) => {
            const orderA = Number(a.order ?? a.order_display ?? 0)
            const orderB = Number(b.order ?? b.order_display ?? 0)
            return orderA - orderB
          })
          const normalized = normalizeServices(sorted)
          setServices(normalized)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized))
          setLoading(false)
          return
        }
      } catch (err: any) {
        console.warn('Supabase fetch services warning, falling back to local storage:', err?.message)
      }
    }

    // Fallback Local Storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const normalized = normalizeServices(parsed)
        setServices(normalized)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized))
      } catch {
        setServices(INITIAL_SERVICES)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SERVICES))
      }
    } else {
      setServices(INITIAL_SERVICES)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SERVICES))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const saveServicesLocally = (newList: Service[]) => {
    setServices(newList)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList))
  }

  const addService = async (service: Omit<Service, 'id'>) => {
    const newId = 's_' + Date.now()
    const newService: Service = { ...service, id: newId }

    if (isSupabaseConfigured) {
      try {
        const payload: any = {
          title: service.title,
          description: service.description,
          icon: service.icon || 'Stethoscope',
          image_url: service.image_url || '',
          highlight: service.highlight || '',
          active: service.active ?? true,
          order: service.order || 1,
          order_display: service.order || 1
        }
        const { data, error } = await supabase
          .from('services')
          .insert([payload])
          .select()
        if (!error && data && data[0]) {
          await fetchServices()
          return data[0]
        }
      } catch (err) {
        console.warn('Supabase add service error, using local mode:', err)
      }
    }

    const updated = [...services, newService]
    saveServicesLocally(updated)
    return newService
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    if (isSupabaseConfigured) {
      try {
        const payload: any = { ...updates, updated_at: new Date().toISOString() }
        if (updates.order !== undefined) {
          payload.order_display = updates.order
        }
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id)
        if (!error) {
          await fetchServices()
          return
        }
      } catch (err) {
        console.warn('Supabase update service error, using local mode:', err)
      }
    }

    const updated = services.map(s => s.id === id ? { ...s, ...updates } : s)
    saveServicesLocally(updated)
  }

  const deleteService = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id)
        if (!error) {
          await fetchServices()
          return
        }
      } catch (err) {
        console.warn('Supabase delete service error, using local mode:', err)
      }
    }

    const updated = services.filter(s => s.id !== id)
    saveServicesLocally(updated)
  }

  return {
    services,
    loading,
    error,
    refreshServices: fetchServices,
    addService,
    updateService,
    deleteService
  }
}

