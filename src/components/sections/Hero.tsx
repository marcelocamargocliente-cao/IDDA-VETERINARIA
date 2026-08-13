import React from 'react'
import { Calendar, Phone, ShieldCheck, Heart, Award, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Photo } from '../../types'
import fachadaImg from '../../assets/fachada.jpg'

interface HeroProps {
  heroPhoto?: Photo
}

export const Hero: React.FC<HeroProps> = ({ heroPhoto }) => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`
  const whatsappEmergency = `https://wa.me/5521986260484?text=${encodeURIComponent('Preciso de atendimento de urgência!')}`

  const imageUrl = heroPhoto?.url || fachadaImg

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-[#f0faf4] via-[#eef8f2] to-[#f0faf4]">
      {/* Decorative subtle background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#1B7A3E]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#1B7A3E]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#dcf5e7] text-[#1B7A3E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-[#1B7A3E]" />
              <span>Especialistas em Bem-Estar</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#062614] leading-[1.12] tracking-tight">
              O cuidado que seu <br />
              <span className="italic text-[#1B7A3E]">melhor amigo</span> merece.
            </h1>

            <p className="text-[#0F5A2C] opacity-85 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Na <strong className="text-[#062614] font-semibold">IDDA Veterinária</strong>, combinamos tecnologia de ponta com atendimento humanizado para garantir a saúde e felicidade do seu pet.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#1B7A3E] hover:bg-[#166633] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-verde-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Consulta</span>
              </a>

              <a
                href={whatsappEmergency}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#E63329] hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-md transition-all urgencia-pulse"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Urgência 24h</span>
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#dcf5e7]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B7A3E] font-display">15k+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#0F5A2C] opacity-70 mt-1">Pets Atendidos</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B7A3E] font-display">12+</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#0F5A2C] opacity-70 mt-1">Especialidades</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B7A3E] font-display">24/7</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#0F5A2C] opacity-70 mt-1">Plantão Médico</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#dcf5e7] p-4 sm:p-6 rounded-[40px] shadow-xl">
              <div className="relative bg-white rounded-[32px] overflow-hidden border-4 border-white shadow-lg aspect-[4/5]">
                <img
                  src={imageUrl}
                  alt="Fachada da IDDA Veterinária - Cosmos, Rio de Janeiro"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062614]/80 via-transparent to-transparent" />
                
                {/* Floating Testimonial Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                    <span className="text-[10px] font-bold text-[#1B7A3E] uppercase tracking-wider bg-verde-50 px-2 py-0.5 rounded">
                      Depoimento
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm italic text-[#0F5A2C] leading-relaxed font-medium">
                    "{heroPhoto?.caption || 'A equipe da IDDA salvou o meu Billy. Eternamente grata pelo profissionalismo e amor.'}"
                  </p>
                  <div className="mt-2 text-xs font-bold text-[#062614] flex items-center justify-between">
                    <span>— Mariana & Billy (Golden)</span>
                    <span className="text-[10px] text-[#1B7A3E] font-semibold">Tutor IDDA</span>
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
