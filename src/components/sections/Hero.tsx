import React from 'react'
import { Calendar, Phone, ShieldCheck, Heart, Award, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Photo } from '../../types'

interface HeroProps {
  heroPhoto?: Photo
}

export const Hero: React.FC<HeroProps> = ({ heroPhoto }) => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`

  const defaultHeroImage = 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80'
  const imageUrl = heroPhoto?.url || defaultHeroImage

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-verde-50/70 via-stone-50 to-stone-50">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-verde-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-verde-100/80 border border-verde-500/20 text-verde-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-verde-600" />
              <span>Clínica Veterinária de Alta Complexidade</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] tracking-tight">
              Excelência médica e carinho que o seu pet <span className="text-verde-600 underline decoration-verde-500/30 underline-offset-4">merece</span>.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Na <strong className="text-stone-800 font-semibold">IDDA Veterinária</strong>, combinamos uma estrutura hospitalar moderna com profissionais apaixonados por animais. Consultas, vacinas, exames e plantão de urgência 24 horas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-verde-500 hover:bg-verde-600 text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-verde-500/25 hover:shadow-xl hover:shadow-verde-500/35 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Consulta</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="tel:11999999999"
                className="flex items-center justify-center gap-2.5 bg-stone-900 hover:bg-black text-white px-6 py-3.5 rounded-xl font-semibold text-base shadow-md transition-all border border-stone-800"
              >
                <Phone className="w-5 h-5 text-urgencia animate-pulse" />
                <span>Urgência 24h</span>
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200/80">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-verde-100 text-verde-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-stone-900 font-bold text-sm">Pronto Socorro 24h</span>
                  <span className="text-stone-500 text-xs">Equipe de plantão</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-verde-100 text-verde-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-stone-900 font-bold text-sm">+15.000 Pets</span>
                  <span className="text-stone-500 text-xs">Atendidos com amor</span>
                </div>
              </div>

              <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                <div className="w-9 h-9 rounded-lg bg-verde-100 text-verde-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-stone-900 font-bold text-sm">Estrutura Completa</span>
                  <span className="text-stone-500 text-xs">Exames & Cirurgias</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-verde-500/20 to-emerald-500/10 blur-xl -z-10" />

              <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-stone-200/80">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={imageUrl}
                    alt="Atendimento na IDDA Veterinária"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/50 shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-verde-500 flex items-center justify-center text-white shrink-0">
                      <Heart className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase text-verde-600 tracking-wider block">IDDA Cuidado Humanizado</span>
                      <p className="text-xs text-stone-700 font-medium line-clamp-1">
                        {heroPhoto?.caption || "Manejo livre de medo e estresse para cães e gatos."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
