import React from 'react'
import { Heart, MapPin, Phone, Clock, ShieldAlert, ArrowUpRight, Instagram } from 'lucide-react'

export const Footer: React.FC = () => {
  const whatsappMessage = encodeURIComponent('Olá! Vim pelo site da IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <footer className="bg-[#062614] text-[#dcf5e7] pt-16 pb-8 border-t border-[#0F5A2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B7A3E] flex items-center justify-center text-white shadow-md">
                <Heart className="w-6 h-6 fill-white stroke-[#1B7A3E]" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight block">
                  IDDA <span className="text-[#1B7A3E] font-semibold">Veterinária</span>
                </span>
                <span className="text-[10px] text-[#dcf5e7]/80 font-medium tracking-widest uppercase block">
                  Clínica & Centro Médico 24h
                </span>
              </div>
            </div>

            <p className="text-[#dcf5e7]/80 text-sm leading-relaxed">
              Dedicados à saúde, longevidade e bem-estar dos seus animais de estimação. Infraestrutura completa de diagnósticos, cirurgias e plantão 24h.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B7A3E] hover:text-[#dcf5e7] transition-colors"
              >
                Falar com a Recepção <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/iddaveterinaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#dcf5e7]/90 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#1B7A3E]" />
                <span>@iddaveterinaria</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Navegação Rápida</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-[#1B7A3E] transition-colors">Início</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#1B7A3E] transition-colors">Serviços Clínicos & Cirúrgicos</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#1B7A3E] transition-colors">Nossa Estrutura</a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-[#1B7A3E] transition-colors">Por que escolher a IDDA</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-[#1B7A3E] transition-colors">O que dizem os Tutores</a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-[#1B7A3E] transition-colors">Localização e Contato</a>
              </li>
            </ul>
          </div>

          {/* Working Hours & Emergency */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Horário de Funcionamento</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-[#0F5A2C]/60 rounded-2xl p-4 border border-[#1B7A3E]/40">
                <p className="font-bold text-white">Atendimento 24 Horas</p>
                <p className="text-[#dcf5e7]/90 text-sm">Todos os dias, inclusive feriados</p>
              </div>
              
              <div className="bg-[#E63329]/20 rounded-2xl p-4 border border-[#E63329]/30 mt-2">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#E63329] inline shrink-0" />
                  Pronto Atendimento 24 Horas
                </p>
                <p className="text-red-100 text-sm">Equipe de plantão ininterrupto</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Atendimento & Endereço</h3>
            <ul className="space-y-3 text-sm text-[#dcf5e7]/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1B7A3E] shrink-0 mt-0.5" />
                <div>
                  <p>Caminho do Tutóia, Lt. 37 Qd. 118 lj. 2</p>
                  <p className="text-xs text-[#dcf5e7]/60">Cosmos, Rio de Janeiro - RJ, CEP: 23060-275</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1B7A3E] shrink-0" />
                <span>(21) 98626-0484 / (21) 99857-0710</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#0F5A2C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#dcf5e7]/60 gap-4">
          <p>© {new Date().getFullYear()} IDDA Veterinária. Todos os direitos reservados.</p>
          <p className="text-[#dcf5e7]/60">Cosmos, Rio de Janeiro - RJ</p>
        </div>
      </div>
    </footer>
  )
}
