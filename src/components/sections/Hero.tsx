import React, { useEffect, useState } from 'react'
import { Calendar, ArrowRight, Sparkles, Star } from 'lucide-react'
import { CLINIC_CONFIG } from '../../config/constants'
import { supabase } from '../../lib/supabase'
import defaultHeroDogImage from '../../assets/images/idda_hero_horizontal_16_9_1786671030992.jpg'

export const Hero: React.FC = () => {
  const [heroUrl, setHeroUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image').single()
        if (data?.value) setHeroUrl(data.value)
      } catch (e) {
        console.error('Error loading hero image:', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHero()

    const channel = supabase.channel('hero-settings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload: any) => {
        if (payload.new?.key === 'hero_image') {
          setHeroUrl(payload.new.value)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const imageUrl = heroUrl || defaultHeroDogImage
  const whatsappUrl = CLINIC_CONFIG.whatsappUrl('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')

  return (
    <section id="inicio" className="relative pt-24 pb-12 md:pt-28 md:pb-20 overflow-hidden bg-[#F5F1ED]">
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#D4C5B9]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#6B8E6F]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#D4C5B9] text-[#8B7355] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>Cuidado Veterinário Premium</span>
            </div>

            <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.03em]">
              Saúde que seu pet merece. <br />
              <span className="italic text-[#6B8E6F] font-normal">Amor que ele reconhece.</span>
            </h1>

            <p className="text-[#4A4A4A] text-base sm:text-lg leading-[1.6] max-w-xl font-normal">
              Combinamos tecnologia de ponta com atendimento humanizado. Porque seu pet não é só animal de estimação — <strong className="text-[#1A1A1A] font-semibold">é família</strong>.
            </p>

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

          <div className="lg:col-span-5">
            <div className="p-3 sm:p-4 bg-[#D4C5B9]/60 rounded-3xl shadow-lg border border-[#D4C5B9]">
              <div className="relative bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm h-80 sm:h-96 lg:h-[420px] group">
                {isLoading ? (
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-stone-400 text-sm font-medium">Carregando foto...</span>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt="Golden Retriever em frente à Clínica IDDA Veterinária"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.src = defaultHeroDogImage
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
