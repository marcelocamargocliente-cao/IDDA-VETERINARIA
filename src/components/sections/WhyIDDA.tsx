import React from 'react'
import { Heart, Users, Award, Star, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'

export const WhyIDDA: React.FC = () => {
  const stats = [
    {
      icon: Heart,
      value: '10,000+',
      label: 'Pets Felizes Atendidos',
      sublabel: 'Cães e gatos cuidados com amor'
    },
    {
      icon: Users,
      value: '98%',
      label: 'Satisfação dos Tutores',
      sublabel: 'Avaliações positivas e lealdade'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Anos de Experiência',
      sublabel: 'Dedicação contínua à medicina'
    },
    {
      icon: Star,
      value: '5.0',
      label: 'Nota Máxima no Google',
      sublabel: 'Centenas de tutores satisfeitos'
    }
  ]

  return (
    <section id="por-que-idda" className="py-20 sm:py-24 bg-[#F5F1ED] border-y border-[#D4C5B9]/60 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#D4C5B9]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B7355] bg-[#FFFFFF] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9] shadow-2xs">
            Nossos Números & Trajetória
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Confiança que você merece. <br />
            <span className="italic text-[#6B8E6F] font-normal">Amor que seu pet reconhece.</span>
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Especialistas dedicados ao bem-estar integral do seu companheiro, com tecnologia de ponta e carinho em cada consulta.
          </p>
        </div>

        {/* 4 Columns Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#D4C5B9]/60 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-between"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F5F1ED] border border-[#D4C5B9] flex items-center justify-center text-[#6B8E6F] mb-6">
                  <IconComp className="w-7 h-7" />
                </div>

                <div>
                  <div className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <h3 className="font-semibold text-base text-[#1A1A1A] mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-[#888888]">
                    {stat.sublabel}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5F1ED] w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#6B8E6F]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Padrão IDDA</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

