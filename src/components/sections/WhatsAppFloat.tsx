import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export const WhatsAppFloat: React.FC = () => {
  const [tooltipOpen, setTooltipOpen] = useState(true)

  const whatsappMessage = encodeURIComponent('Olá! Vim pelo site e preciso de atendimento na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* Compact Semi-Transparent Tooltip Popup */}
      {tooltipOpen && (
        <div className="pointer-events-auto bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-stone-200/80 max-w-[260px] text-xs text-stone-700 relative animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100/80 transition-colors"
            aria-label="Fechar mensagem"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 mb-1 pr-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-stone-900 text-xs">Atendimento On-line IDDA</span>
          </div>

          <p className="text-[11px] text-stone-600 leading-snug mb-2">
            Consultas, exames ou dúvidas emergenciais? Fale conosco!
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] py-1.5 px-3 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Falar com Atendimento</span>
          </a>
        </div>
      )}

      {/* Main Floating Circle Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-300"
        aria-label="Atendimento WhatsApp IDDA Veterinária"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-emerald-600" />
        
        {/* Pulse Effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping -z-10" />
      </a>

    </div>
  )
}
