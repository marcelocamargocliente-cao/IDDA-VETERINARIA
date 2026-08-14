import React from 'react'
import { Calendar, ArrowRight, ShieldCheck, Heart, Sparkles, Star } from 'lucide-react'
import { Photo } from '../../types'
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../hooks/useSiteSettings'
import { CLINIC_CONFIG } from '../../config/constants'

interface HeroProps {
  heroPhoto?: Photo
}

export const Hero: React.FC<HeroProps> = ({ heroPhoto }) => {
  const { getSetting } = useSiteSettings()
  const whatsappUrl = CLINIC_CONFIG.whatsappUrl('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')

  const settingHeroImage = getSetting('hero_image', DEFAULT_SITE_SETTINGS.hero_image)
  const imageUrl = settingHeroImage || heroPhoto?.url || DEFAULT_SITE_SETTINGS.hero_image

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#F5F1ED]">
      {/* Decorative Subtle Ambient Elements */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#D4C5B9]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#6B8E6F]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#D4C5B9] text-[#8B7355] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>Cuidado Veterinário Premium</span>
            </div>

            {/* Main Serif Heading */}
            <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.03em]">
              Saúde que seu pet merece. <br />
              <span className="italic text-[#6B8E6F] font-normal">Amor que ele reconhece.</span>
            </h1>

            {/* Subheading Body */}
            <p className="text-[#4A4A4A] text-base sm:text-lg leading-[1.6] max-w-xl font-normal">
              Combinamos tecnologia de ponta com atendimento humanizado. Porque seu pet não é só animal de estimação — <strong className="text-[#1A1A1A] font-semibold">é família</strong>.
            </p>

            {/* CTA Buttons - Lado a Lado */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Agora</span>
              </a>

              <a
                href="#servicos"
                className="flex items-center justify-center gap-2 border-2 border-[#6B8E6F] text-[#6B8E6F] hover:bg-[#FFFFFF] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Conhecer Serviços</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Indicators (3 Columns) */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D4C5B9]/60 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-serif-heading">10k+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Pets Felizes</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-serif-heading">6+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Serviços Clínicos</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#6B8E6F] font-serif-heading flex items-center gap-1">
                  <span>5.0</span>
                  <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Avaliação Google</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Elegant Beige Frame */}
          <div className="lg:col-span-5">
            <div className="relative p-3 sm:p-4 bg-[#D4C5B9]/60 rounded-3xl shadow-lg border border-[#D4C5B9]">
              <div className="relative bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm aspect-[4/5] group">
                <img
                  src={imageUrl}
                  alt="Estrutura e Fachada IDDA Veterinária - Cosmos, Rio de Janeiro"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.src = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80'
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/75 via-transparent to-transparent pointer-events-none" />

                {/* Floating Social Proof Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-xl border border-[#D4C5B9]/70 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-[#D4A574] text-xs">★★★★★</div>
                    <span className="text-[10px] font-bold text-[#6B8E6F] uppercase tracking-wider bg-[#F5F1ED] px-2 py-0.5 rounded">
                      Tutor Verificado
                    </span>
                  </div>
                  <p className="text-xs italic text-[#4A4A4A] leading-snug">
                    "Atendimento atencioso, rápido amor pelos animais. Estrutura completa com exames e consultas!"
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-[#1A1A1A] flex items-center justify-between">
                    <span>— IDDA Veterinária</span>
                    <span className="text-[10px] text-[#6B8E6F] font-semibold">Cosmos, RJ</span>
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

