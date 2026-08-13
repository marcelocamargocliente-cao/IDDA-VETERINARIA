import React, { useState } from 'react'
import { Stethoscope, Activity, Scissors, ShieldAlert, Sparkles, X, Calendar, Check, ArrowRight, HeartPulse } from 'lucide-react'
import { Service } from '../../types'

interface ServicesProps {
  services: Service[]
  loading?: boolean
}

export const Services: React.FC<ServicesProps> = ({ services, loading }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showAllServices, setShowAllServices] = useState(false)

  const activeServices = services.filter(s => s.active)
  const featuredServices = activeServices.slice(0, 3)
  const extraServices = activeServices.slice(3)

  const whatsappMessage = (serviceName: string) => 
    encodeURIComponent(`Olá! Gostaria de agendar o serviço de ${serviceName} na IDDA Veterinária.`)

  return (
    <section id="servicos" className="py-20 sm:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Centered */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B8E6F] bg-[#F5F1ED] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9]">
            Cuidado Médico Completo
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Serviços que transformam a saúde do seu pet
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Do check-up preventivo aos procedimentos cirúrgicos mais delicados, nossa equipe e estrutura estão prontas para cuidar de quem você ama.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F5F1ED] rounded-2xl overflow-hidden animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* 3 Main Featured Cards (Grid 3 Colunas com Fotos Grandes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="group bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#D4C5B9]/60 hover:border-[#6B8E6F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Service Photo with Zoom Effect */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent pointer-events-none" />
                    
                    {service.highlight && (
                      <span className="absolute top-4 right-4 bg-[#6B8E6F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {service.highlight}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4 text-white">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#D4C5B9]">
                        IDDA Veterinária
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
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
                        onClick={() => setSelectedService(service)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B8E6F] group-hover:text-[#5A7A5F] transition-colors"
                      >
                        <span>Ver Detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>

                      <a
                        href={`https://wa.me/5521986260484?text=${whatsappMessage(service.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#F5F1ED] hover:bg-[#6B8E6F] text-[#1A1A1A] hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      >
                        Agendar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Services Grid / Accordion */}
            {extraServices.length > 0 && (
              <div className="space-y-6">
                {!showAllServices ? (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setShowAllServices(true)}
                      className="inline-flex items-center gap-2 bg-[#F5F1ED] hover:bg-[#D4C5B9]/40 text-[#1A1A1A] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-[#6B8E6F]" />
                      <span>Ver Todos os {activeServices.length} Serviços Disponíveis</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 animate-in fade-in duration-300">
                    {extraServices.map((service) => (
                      <div
                        key={service.id}
                        className="group bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#D4C5B9]/60 hover:border-[#6B8E6F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif-heading font-bold text-xl text-[#1A1A1A] mb-3 group-hover:text-[#6B8E6F] transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed line-clamp-3 mb-6">
                              {service.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#F5F1ED] flex items-center justify-between">
                            <button
                              onClick={() => setSelectedService(service)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B8E6F]"
                            >
                              <span>Ver Detalhes</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`https://wa.me/5521986260484?text=${whatsappMessage(service.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#F5F1ED] hover:bg-[#6B8E6F] text-[#1A1A1A] hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            >
                              Agendar
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Service Details Lightbox Modal */}
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedService(null)}
          >
            <div 
              className="relative max-w-2xl w-full bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#D4C5B9]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative aspect-[16/9] bg-[#1A1A1A]">
                <img
                  src={selectedService.image_url}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h3 className="font-serif-heading text-2xl font-bold">{selectedService.title}</h3>
                </div>
              </div>

              {/* Modal Body */}
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
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F]" />
                      Atendimento humanizado com manejo low-stress para cães e gatos.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F]" />
                      Equipamentos modernos e protocolos alinhados à medicina veterinária contemporânea.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F]" />
                      Esclarecimento detalhado de condutas e orientações pós-atendimento aos tutores.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#4A4A4A] hover:bg-[#F5F1ED] transition-colors"
                  >
                    Fechar
                  </button>
                  <a
                    href={`https://wa.me/5521986260484?text=${whatsappMessage(selectedService.title)}`}
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

