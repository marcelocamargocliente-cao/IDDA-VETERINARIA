import React from 'react'
import { ShieldAlert, Award, Heart, Sparkles, Activity, Clock, Users, CheckCircle2 } from 'lucide-react'

export const WhyIDDA: React.FC = () => {
  const differentials = [
    {
      icon: Clock,
      title: 'Atendimento e Emergência 24h',
      description: 'Equipe veterinária de plantão ininterrupto 365 dias por ano para emergências médicas, cirurgias de urgência e internação.',
      highlight: 'Sempre abertos'
    },
    {
      icon: Users,
      title: 'Corpo Clínico Especializado',
      description: 'Especialistas nas áreas de Dermatologia, Cardiologia, Ortopedia, Oftalmologia, Oncologia e Cirurgia Geral.',
      highlight: 'Médicos Pós-Graduados'
    },
    {
      icon: Heart,
      title: 'Manejo Cat Friendly & Low Stress',
      description: 'Ambientes e internações separadas por espécie para minimizar o estresse e oferecer máximo conforto durante a consulta.',
      highlight: 'Zero Estresse'
    },
    {
      icon: Activity,
      title: 'Exames Rápidos & Laboratório Próprio',
      description: 'Aparelhos de Ultrassom com Doppler, Raio-X Digital e exames de sangue com resultados no mesmo dia.',
      highlight: 'Agilidade Diagnóstica'
    },
    {
      icon: ShieldAlert,
      title: 'Bloco Cirúrgico Avançado',
      description: 'Anestesia inalatória, monitorização multiparamétrica e sala de recuperação anestésica com aquecimento.',
      highlight: 'Máxima Segurança'
    },
    {
      icon: Sparkles,
      title: 'Transparência & Acompanhamento',
      description: 'Boletins médicos frequentes com fotos e vídeos para os tutores durante todo o período de internação.',
      highlight: 'Tranquilidade para o Tutor'
    }
  ]

  return (
    <section id="diferenciais" className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-verde-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-verde-400 bg-verde-950/80 px-3.5 py-1.5 rounded-full inline-block border border-verde-500/30 mb-3">
            O Padrão de Qualidade IDDA
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Por que confiarem o seu melhor amigo à IDDA Veterinária?
          </h2>
          <p className="text-stone-400 text-base leading-relaxed">
            Investimos continuamente na melhoria técnica da nossa equipe e em tecnologias que salvam vidas todos os dias.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentials.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <div
                key={idx}
                className="bg-stone-800/80 border border-stone-700/80 hover:border-verde-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-verde-950/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-verde-500/20 border border-verde-500/30 flex items-center justify-center text-verde-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-verde-400 bg-verde-950 px-2.5 py-1 rounded-md border border-verde-500/20">
                      {item.highlight}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-xl text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-stone-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-700/60 flex items-center gap-2 text-xs font-medium text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-verde-400 shrink-0" />
                  <span>Compromisso IDDA com o seu pet</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
