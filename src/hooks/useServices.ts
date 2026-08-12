import { useState, useEffect } from 'react'
import { Service } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Atendimento de Urgência & Emergência',
    description: 'Pronto atendimento estruturado para casos críticos, traumas, exames rápidos e estabilização imediata.',
    icon: 'ShieldAlert',
    active: true,
    order: 1
  },
  {
    id: 's2',
    title: 'Consultas Clínicas Especializadas',
    description: 'Acompanhamento preventivo e tratamentos em Dermatologia, Cardiologia, Oftalmologia, Nefrologia e Oncologia.',
    icon: 'Stethoscope',
    active: true,
    order: 2
  },
  {
    id: 's3',
    title: 'Cirurgias Geral e Ortopédica',
    description: 'Bloco cirúrgico moderno equipado com anestesia inalatória, monitorização multiparamétrica e UTI pós-operatória.',
    icon: 'Activity',
    active: true,
    order: 3
  },
  {
    id: 's4',
    title: 'Exames Laboratoriais e Imagem',
    description: 'Ultrassonografia com Doppler, Raio-X digital e laboratório próprio para resultados ágeis e diagnósticos precisos.',
    icon: 'Microscope',
    active: true,
    order: 4
  },
  {
    id: 's5',
    title: 'Vacinação & Microchipagem',
    description: 'Protocolos de imunização importados e personalizados para cães e gatos, além de aplicação de microchips de identificação.',
    icon: 'ShieldCheck',
    active: true,
    order: 5
  },
  {
    id: 's6',
    title: 'Internação e Cuidados Intensivos',
    description: 'Acomodações individuais e climatizadas, separadas por espécie (cães e gatos), com monitoramento contínuo 24h.',
    icon: 'HeartPulse',
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
