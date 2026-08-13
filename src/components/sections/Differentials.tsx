import React from 'react'
import { Heart, GraduationCap, Building2, ShieldCheck, Sparkles, Check } from 'lucide-react'

export const Differentials: React.FC = () => {
  const items = [
    {
      icon: Heart,
      title: 'Humanidade & Empatia',
      tag: 'Cuidado Acolhedor',
      description: 'Entendemos que seu pet é família. Cada toque, cada exame e cada acolhimento reflete nosso profundo respeito, paciência e amor incondicional pelos animais.',
      points: ['Manejo Cat-Friendly e Low Stress', 'Acolhimento calmo aos tutores', 'Acompanhamento pós-consulta']
    },
    {
      icon: GraduationCap,
      title: 'Expertise Veterinária',
      tag: 'Excelência Médica',
      description: 'Equipe veterinária em constante atualização nas melhores práticas, técnicas cirúrgicas modernas e protocolos terapêuticos de alto padrão.',
      points: ['Médicos dedicados', 'Condutas baseadas em evidências', 'Transparência em cada diagnóstico']
    },
    {
      icon: Building2,
      title: 'Estrutura Completa & Diagnósticos',
      tag: 'Tecnologia Avançada',
      description: 'Consultórios confortáveis, bloco cirúrgico equipado, ultrassom com Doppler, raio-x digital e laboratório para agilidade máxima no tratamento.',
      points: ['Exames com resultados rápidos', 'Ambientes esterilizados e seguros', 'Monitorização cirúrgica contínua']
    }
  ]

  return (
    <section id="diferenciais" className="py-20 sm:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B8E6F] bg-[#F5F1ED] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9]">
            Pilares de Atendimento
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            O que nos torna especiais
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Combinamos a precisão da medicina moderna com a sensibilidade e dedicação que seu pet merece em cada fase da vida.
          </p>
        </div>

        {/* 3 Columns Big Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="group bg-[#F5F1ED]/70 rounded-2xl p-8 sm:p-9 border border-[#D4C5B9]/70 hover:border-[#6B8E6F] hover:bg-[#FFFFFF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFFFFF] border border-[#D4C5B9] flex items-center justify-center text-[#6B8E6F] group-hover:bg-[#6B8E6F] group-hover:text-white transition-all shadow-2xs">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7355] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#D4C5B9]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-serif-heading font-bold text-2xl text-[#1A1A1A] mb-4 group-hover:text-[#6B8E6F] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#D4C5B9]/50 space-y-2.5">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs font-medium text-[#4A4A4A]">
                      <Check className="w-3.5 h-3.5 text-[#6B8E6F] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
