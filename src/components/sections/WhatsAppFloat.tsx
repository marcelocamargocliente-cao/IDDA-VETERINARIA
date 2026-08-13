import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export const WhatsAppFloat: React.FC = () => {
  const [tooltipOpen, setTooltipOpen] = useState(true)

  const whatsappMessage = encodeURIComponent('Olá! Vim pelo site e preciso de atendimento na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <aside aria-label="Atendimento Online WhatsApp" className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-1.5 pointer-events-none">
      
      {/* Compact Semi-Transparent Tooltip Popup - 25-30% smaller, discreet, non-intrusive */}
      {tooltipOpen && (
        <div className="pointer-events-auto bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-stone-200/80 max-w-[240px] text-xs text-stone-700 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute top-1.5 right-1.5 text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100/80 transition-colors"
            aria-label="Fechar mensagem de atendimento"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1.5 mb-1 pr-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-stone-900 text-xs tracking-tight">Atendimento On-line IDDA</span>
          </div>

          <p className="text-[11px] text-stone-600 leading-snug mb-2">
            Consultas, exames ou dúvidas? Fale com a nossa equipe!
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-lg transition-colors shadow-xs"
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
        className="pointer-events-auto group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all duration-300"
        aria-label="Falar com Atendimento WhatsApp IDDA Veterinária"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-emerald-600" />
        
        {/* Pulse Effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping -z-10" />
      </a>

    </aside>
  )
}

