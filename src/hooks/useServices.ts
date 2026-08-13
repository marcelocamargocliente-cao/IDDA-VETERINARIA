import { useState, useEffect } from 'react'
import { Service } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Consultas Clínicas',
    description: 'Atendimento clínico geral, avaliação preventiva e diagnósticos precisos para a saúde e bem-estar de cães e gatos.',
    icon: 'Stethoscope',
    active: true,
    order: 1
  },
  {
    id: 's2',
    title: 'Cirurgias (Geral e Eletivas)',
    description: 'Procedimentos cirúrgicos gerais, castrações e cirurgias de urgência com bloco equipado e monitoramento anestésico.',
    icon: 'Activity',
    active: true,
    order: 2
  },
  {
    id: 's3',
    title: 'Vacinação & Imunização',
    description: 'Protocolos de vacinação essenciais e atualizados para proteção de cães e gatos em todas as fases da vida.',
    icon: 'ShieldCheck',
    active: true,
    order: 3
  },
  {
    id: 's4',
    title: 'Exames Laboratoriais',
    description: 'Coleta de sangue, fezes, urina e análises clínicas para acompanhamento e diagnósticos rápidos.',
    icon: 'Microscope',
    active: true,
    order: 4
  },
  {
    id: 's5',
    title: 'Ultrassonografia',
    description: 'Diagnóstico por imagem não invasivo para avaliação detalhada de órgãos abdominais e gestacionais.',
    icon: 'HeartPulse',
    active: true,
    order: 5
  },
  {
    id: 's6',
    title: 'Raio-X Digital',
    description: 'Exames radiográficos digitais de alta resolução para avaliação óssea, articular, torácica e abdominal.',
    icon: 'ShieldAlert',
    active: true,
    order: 6
  }
]

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
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setServices(data)
          setLoading(false)
          return
        }
      } catch (err: any) {
        console.warn('Supabase fetch failed, falling back to local storage:', err.message)
      }
    }

    // Fallback Local Storage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setServices(JSON.parse(saved))
      } catch {
        setServices(INITIAL_SERVICES)
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
        const { data, error } = await supabase
          .from('services')
          .insert([service])
          .select()
        if (!error && data && data[0]) {
          await fetchServices()
          return data[0]
        }
      } catch (err) {
        console.warn('Supabase add failed, using local mode', err)
      }
    }

    const updated = [...services, newService]
    saveServicesLocally(updated)
    return newService
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
        if (!error) {
          await fetchServices()
          return
        }
      } catch (err) {
        console.warn('Supabase update failed, using local mode', err)
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
        console.warn('Supabase delete failed, using local mode', err)
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
