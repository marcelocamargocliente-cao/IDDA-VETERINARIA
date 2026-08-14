import React from 'react'
import { MessageCircle } from 'lucide-react'

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '5521986260484'
  const whatsappMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os serviços da IDDA Veterinária.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <>
      <style>{`
        @keyframes pulse-float {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.95;
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(107, 142, 111, 0.75);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(107, 142, 111, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(107, 142, 111, 0);
          }
        }

        .whatsapp-button-pulse {
          animation: pulse-float 2.5s ease-in-out infinite;
        }

        .whatsapp-pulse-ring {
          animation: pulse-ring 2.5s ease-out infinite;
        }
      `}</style>

      {/* Container com anel pulsante */}
      <aside aria-label="Atendimento WhatsApp" className="fixed bottom-6 right-6 z-40">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block focus:outline-none focus:ring-4 focus:ring-[#6B8E6F]/30 rounded-full cursor-pointer"
          title="Falar com atendimento via WhatsApp"
          aria-label="Falar com atendimento via WhatsApp"
        >
          {/* Anel de Pulsação (background) */}
          <div className="absolute inset-0 rounded-full bg-[#6B8E6F] whatsapp-pulse-ring" />

          {/* Botão Redondo com Ícone - Aumentado para 80px desktop / 72px mobile */}
          <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 bg-[#6B8E6F] hover:bg-[#5A7A5F] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 whatsapp-button-pulse">
            <MessageCircle className="w-9 h-9 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
          </div>

          {/* Tooltip ao hover (Desktop) */}
          <div className="hidden sm:block absolute bottom-full right-0 mb-4 bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap pointer-events-none">
            Fale com a gente!
            {/* Seta apontando para baixo */}
            <div className="absolute top-full right-6 w-2 h-2 bg-[#1A1A1A] transform -translate-y-1 rotate-45" />
          </div>
        </a>
      </aside>
    </>
  )
}

// Backward compatibility export if needed
export const WhatsAppFloat = WhatsAppButton
