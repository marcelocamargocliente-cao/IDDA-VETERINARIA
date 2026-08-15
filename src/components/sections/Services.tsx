import { imgPresets } from '../../lib/imageUtils'
import React, { useState, useEffect } from 'react'
import { Sparkles, X, Calendar, Check, ArrowRight, HeartPulse, ImageIcon } from 'lucide-react'
import { Service } from '../../types'
import { CLINIC_CONFIG } from '../../config/constants'
import { supabase } from '../../lib/supabase'

const DEFAULT_FALLBACK_IMAGES: Record<string, string> = {
  urgencia: 'https://images.unsplash.com/photo-1587300411515-65a60b8acf36?w=800&h=600&fit=crop',
  consultas: 'https://images.unsplash.com/photo-1516738901601-4c0a165b8e35?w=800&h=600&fit=crop',
  cirurgias: 'https://images.unsplash.com/photo-1631217314830-e1ee96e2c07d?w=800&h=600&fit=crop',
  default: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=600&fit=crop'
}

function getServiceFallback(title: string): string {
  const lower = (title || '').toLowerCase()
  if (lower.includes('urg') || lower.includes('emerg')) return DEFAULT_FALLBACK_IMAGES.urgencia
  if (lower.includes('cons') || lower.includes('clín') || lower.includes('clin')) return DEFAULT_FALLBACK_IMAGES.consultas
  if (lower.includes('cirurg') || lower.includes('ortop')) return DEFAULT_FALLBACK_IMAGES.cirurgias
  return DEFAULT_FALLBACK_IMAGES.default
}

const DEFAULT_SERVICES: Service[] = [
  { id: '1', title: 'Pronto Atendimento 24h', description: 'Emergências veterinárias atendidas a qualquer hora por equipe especializada.', image_url: DEFAULT_FALLBACK_IMAGES.urgencia, active: true, order: 1, highlight: '24 Horas' },
  { id: '2', title: 'Consultas Especializadas', description: 'Avaliação clínica completa com veterinários dedicados e experientes.', image_url: DEFAULT_FALLBACK_IMAGES.consultas, active: true, order: 2, highlight: 'Clínica Geral' },
  { id: '3', title: 'Centro Cirúrgico', description: 'Cirurgias gerais e ortopédicas com monitoramento anestésico avançado.', image_url: DEFAULT_FALLBACK_IMAGES.cirurgias, active: true, order: 3, highlight: 'Alta Complexidade' },
  { id: '4', title: 'Vacinação & Profilaxia', description: 'Imunização com vacinas importadas e orientação rigorosa.', image_url: DEFAULT_FALLBACK_IMAGES.default, active: true, order: 4 },
  { id: '5', title: 'Exames Laboratoriais', description: 'Resultados rápidos e precisos para diagnósticos seguros.', image_url: DEFAULT_FALLBACK_IMAGES.default, active: true, order: 5 },
  { id: '6', title: 'Ultrassom & Raio-X', description: 'Diagnóstico por imagem de última geração no próprio local.', image_url: DEFAULT_FALLBACK_IMAGES.default, active: true, order: 6 },
]

interface ServiceCardProps {
  service: Service
  onSelect: (service: Service) => void
  getServiceWhatsappUrl: (title: string) => string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, getServiceWhatsappUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageUrl = service.image_url || service.image || getServiceFallback(service.title)

  return (
    <div className="group bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#D4C5B9]/60 hover:border-[#6B8E6F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DFD8]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E8DFD8] animate-pulse flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-[#D4C5B9] animate-bounce" />
          </div>
        )}
        <img
          src={imgPresets.service(imageUrl)}
          alt={service.title}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => { e.currentTarget.src = imageUrl; setImageLoaded(true) }}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/75 via-transparent to-transparent pointer-events-none" />
        {service.highlight && (
          <span className="absolute top-4 right-4 bg-[#6B8E6F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {service.highlight}
          </span>
        )}
        <div className="absolute bottom-3 left-4 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4C5B9]">IDDA Veterinária</span>
        </div>
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-[#1A1A1A] mb-3 group-hover:text-[#6B8E6F] transition-colors">
            {service.title}
          </h3>
          <p className="text-[#4A4A4A] text-sm leading-relaxed line-clamp-3 mb-6">
            {service.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#F5F1ED] flex items-center justify-between">
          <button
            onClick={() => onSelect(service)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B8E6F] group-hover:text-[#5A7A5F] transition-colors"
          >
            <span>Ver Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={getServiceWhatsappUrl(service.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F5F1ED] hover:bg-[#6B8E6F] text-[#1A1A1A] hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
          >
            Agendar
          </a>
        </div>
      </div>
    </div>
  )
}

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showAllServices, setShowAllServices] = useState(false)
  const [modalImageLoaded, setModalImageLoaded] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from('services').select('*').order('order')
        if (data && data.length > 0) {
          setServices(data)
        }
      } catch (err) {
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()

    const channel = supabase.channel('services-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchServices)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const activeServices = services.filter(s => s.active !== false)
  const featuredServices = activeServices.slice(0, 3)
  const extraServices = activeServices.slice(3)

  const getServiceWhatsappUrl = (serviceName: string) => 
    CLINIC_CONFIG.whatsappUrl(`Olá! Gostaria de agendar o serviço de ${serviceName} na IDDA Veterinária.`)

  return (
    <section id="servicos" className="py-20 sm:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B8E6F] bg-[#F5F1ED] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9]">
            Cuidado Médico Completo
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Serviços que transformam a saúde do seu pet
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Do pronto atendimento aos procedimentos cirúrgicos mais delicados, nossa equipe e estrutura estão prontas para cuidar de quem você ama.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F5F1ED] rounded-2xl overflow-hidden animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={setSelectedService}
                  getServiceWhatsappUrl={getServiceWhatsappUrl}
                />
              ))}
            </div>

            {extraServices.length > 0 && (
              <div className="space-y-6">
                {!showAllServices ? (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setShowAllServices(true)}
                      className="inline-flex items-center gap-2 bg-[#F5F1ED] hover:bg-[#D4C5B9]/40 text-[#1A1A1A] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-[#D4C5B9]"
                    >
                      <Sparkles className="w-4 h-4 text-[#6B8E6F]" />
                      <span>Ver Todos os {activeServices.length} Serviços Disponíveis</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 animate-in fade-in duration-300">
                    {extraServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onSelect={setSelectedService}
                        getServiceWhatsappUrl={getServiceWhatsappUrl}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedService && (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => {
              setSelectedService(null)
              setModalImageLoaded(false)
            }}
          >
            <div 
              className="relative max-w-2xl w-full bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#D4C5B9]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] bg-[#E8DFD8] overflow-hidden">
                {!modalImageLoaded && (
                  <div className="absolute inset-0 bg-[#E8DFD8] animate-pulse" />
                )}
                <img
                  src={selectedService.image_url || selectedService.image || getServiceFallback(selectedService.title)}
                  alt={selectedService.title}
                  referrerPolicy="no-referrer"
                  onLoad={() => setModalImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${modalImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <button
                  onClick={() => {
                    setSelectedService(null)
                    setModalImageLoaded(false)
                  }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold">{selectedService.title}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed">
                  {selectedService.description}
                </p>

                <div className="bg-[#F5F1ED] p-4 rounded-xl border border-[#D4C5B9]/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-[#6B8E6F]" />
                    <span>Diferenciais deste atendimento</span>
                  </h4>
                  <ul className="text-xs text-[#4A4A4A] space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F] shrink-0" />
                      <span>Atendimento humanizado com manejo low-stress para cães e gatos.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F] shrink-0" />
                      <span>Equipamentos modernos e protocolos alinhados à medicina veterinária contemporânea.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedService(null)
                      setModalImageLoaded(false)
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#4A4A4A] hover:bg-[#F5F1ED] transition-colors"
                  >
                    Fechar
                  </button>
                  <a
                    href={getServiceWhatsappUrl(selectedService.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar pelo WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
