import React from 'react'
import { Calendar, Phone, MessageCircle, Heart, Sparkles } from 'lucide-react'

export const CtaSection: React.FC = () => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <section className="py-20 sm:py-24 bg-[#6B8E6F] text-white relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/30">
          <Sparkles className="w-3.5 h-3.5 text-[#D4C5B9]" />
          <span>Atendimento Humanizado & Especializado</span>
        </div>

        <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Seu pet merece o melhor cuidado. <br />
          <span className="italic font-normal">Agende uma consulta agora.</span>
        </h2>

        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Venha conhecer nossa clínica na Estrada do Tutóia, 520 em Cosmos, ou fale diretamente com a nossa recepção pelo WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#5A7A5F] hover:bg-[#F5F1ED] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar pelo WhatsApp</span>
          </a>

          <a
            href="tel:21986260484"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/80 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Ligar: (21) 98626-0484</span>
          </a>
        </div>

      </div>
    </section>
  )
}
