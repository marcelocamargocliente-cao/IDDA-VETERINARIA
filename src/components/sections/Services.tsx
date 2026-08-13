import React from 'react'
import { 
  Stethoscope, 
  ShieldAlert, 
  Activity, 
  Microscope, 
  ShieldCheck, 
  HeartPulse, 
  Sparkles, 
  Syringe, 
  Heart, 
  Eye, 
  Bone, 
  Scissors,
  Check,
  Calendar
} from 'lucide-react'
import { Service } from '../../types'

interface ServicesProps {
  services: Service[]
  loading?: boolean
}

// Icon helper to dynamically render Lucide icons by string key
const renderServiceIcon = (iconName: string) => {
  const props = { className: "w-6 h-6 text-verde-600" }
  switch (iconName?.toLowerCase()) {
    case 'shieldalert':
    case 'urgencia':
      return <ShieldAlert className="w-6 h-6 text-urgencia" />
    case 'stethoscope':
    case 'consulta':
      return <Stethoscope {...props} />
    case 'activity':
    case 'cirurgia':
      return <Activity {...props} />
    case 'microscope':
    case 'exames':
      return <Microscope {...props} />
    case 'shieldcheck':
    case 'vacina':
      return <ShieldCheck {...props} />
    case 'heartpulse':
    case 'internacao':
      return <HeartPulse {...props} />
    case 'syringe':
      return <Syringe {...props} />
    case 'heart':
      return <Heart {...props} />
    case 'eye':
      return <Eye {...props} />
    case 'bone':
      return <Bone {...props} />
    case 'scissors':
      return <Scissors {...props} />
    default:
      return <Sparkles {...props} />
  }
}

export const Services: React.FC<ServicesProps> = ({ services, loading }) => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de mais informações sobre os serviços da IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  const activeServices = services.filter(s => s.active)

  return (
    <section id="servicos" className="py-20 bg-stone-100/70 border-y border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-verde-600 bg-verde-100 px-3 py-1 rounded-full inline-block mb-3">
            Serviços Veterinários & Diagnósticos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Cuidados completos para a saúde e longevidade do seu pet
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Consultas clínicas, cirurgias, vacinação, exames laboratoriais e diagnósticos por imagem com equipe dedicada.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-xl bg-stone-200" />
                <div className="h-6 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-full" />
                <div className="h-4 bg-stone-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => {
              const isEmergency = service.title.toLowerCase().includes('urgência') || service.title.toLowerCase().includes('emergência')
              return (
                <div
                  key={service.id}
                  className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border ${
                    isEmergency 
                      ? 'border-urgencia/30 bg-gradient-to-b from-white via-white to-red-50/20' 
                      : 'border-stone-200/80 hover:border-verde-500/40'
                  } flex flex-col justify-between`}
                >
                  <div>
                    {/* Icon container */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                      isEmergency ? 'bg-urgencia/10' : 'bg-verde-50 group-hover:bg-verde-100'
                    }`}>
                      {renderServiceIcon(service.icon)}
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-semibold text-xl text-stone-900 mb-3 group-hover:text-verde-700 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-stone-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Footer Link */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 group-hover:text-verde-600 transition-colors flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-verde-500" /> Atendimento Especializado
                    </span>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        isEmergency 
                          ? 'bg-urgencia text-white hover:bg-red-700' 
                          : 'bg-stone-100 text-stone-800 group-hover:bg-verde-500 group-hover:text-white'
                      }`}
                    >
                      Saber Mais
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-verde-800 to-stone-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Precisa de uma consulta para o seu pet hoje?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base max-w-xl">
              Nossa equipe médica está disponível para responder dúvidas e agendar o melhor horário para você e seu companheiro.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-verde-500 hover:bg-verde-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Falar com Atendimento</span>
          </a>
        </div>

      </div>
    </section>
  )
}
