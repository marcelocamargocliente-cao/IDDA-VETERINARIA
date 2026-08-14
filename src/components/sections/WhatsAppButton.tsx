import React from 'react'
import { MessageCircle } from 'lucide-react'

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '5521986260484'
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os serviços da IDDA Veterinária.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <aside aria-label="Atendimento WhatsApp" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white rounded-full shadow-md hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]/30"
        title="Falar com atendimento via WhatsApp"
        aria-label="Falar com atendimento via WhatsApp"
      >
        {/* Chat Icon */}
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.2} />

        {/* Tooltip on Hover (Desktop) */}
        <div className="hidden sm:block absolute bottom-full right-0 mb-2 bg-[#1A1A1A] text-white px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md whitespace-nowrap pointer-events-none">
          Fale com a gente
          {/* Arrow */}
          <div className="absolute top-full right-3 w-1.5 h-1.5 bg-[#1A1A1A] transform -translate-y-1 rotate-45" />
        </div>
      </a>
    </aside>
  )
}

// Backward compatibility export if needed
export const WhatsAppFloat = WhatsAppButton
