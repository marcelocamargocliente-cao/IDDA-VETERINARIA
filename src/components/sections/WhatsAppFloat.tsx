import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export const WhatsAppFloat: React.FC = () => {
  const [tooltipOpen, setTooltipOpen] = useState(true)

  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta ou tirar dúvidas com a equipe da IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Tooltip Popup */}
      {tooltipOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-stone-200/90 max-w-xs text-xs text-stone-700 relative animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 p-1"
            aria-label="Fechar mensagem"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-stone-900 text-xs">Atendimento On-line IDDA</span>
          </div>

          <p className="text-stone-600 leading-snug">
            Precisa agendar consultas, exames ou precisa de orientação emergencial? Clique para falar via WhatsApp!
          </p>
        </div>
      )}

      {/* Main Floating Circle */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-110 transition-all duration-300"
        aria-label="Atendimento WhatsApp IDDA Veterinária"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-emerald-600" />
        
        {/* Pulse Effect */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping -z-10" />
      </a>

    </div>
  )
}
