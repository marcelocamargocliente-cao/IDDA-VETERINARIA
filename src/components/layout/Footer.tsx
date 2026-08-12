import React from 'react'
import { Heart, MapPin, Phone, Mail, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react'

export const Footer: React.FC = () => {
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de falar com a equipe da IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-verde-500 flex items-center justify-center text-white shadow-md">
                <Heart className="w-6 h-6 fill-white stroke-verde-500" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight block">
                  IDDA <span className="text-verde-500 font-semibold">Veterinária</span>
                </span>
                <span className="text-[10px] text-stone-400 font-medium tracking-widest uppercase block">
                  Clínica & Centro Médico 24h
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed">
              Dedicados à saúde, longevidade e bem-estar dos seus animais de estimação. Infraestrutura completa de diagnósticos, cirurgias e plantão de urgência.
            </p>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Falar com a Recepção <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Navegação Rápida</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-verde-400 transition-colors">Início</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-verde-400 transition-colors">Serviços Clínicos & Cirúrgicos</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-verde-400 transition-colors">Nossa Estrutura</a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-verde-400 transition-colors">Por que escolher a IDDA</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-verde-400 transition-colors">O que dizem os Tutores</a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-verde-400 transition-colors">Localização e Contato</a>
              </li>
            </ul>
          </div>

          {/* Working Hours & Emergency */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Horário de Funcionamento</h3>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60">
                <div className="flex items-center gap-2 text-white font-medium mb-1">
                  <Clock className="w-4 h-4 text-verde-500" />
                  <span>Consultas & Agendamentos</span>
                </div>
                <p className="text-xs">Segunda a Sábado: 08:00 às 20:00</p>
                <p className="text-xs">Domingos e Feriados: 09:00 às 17:00</p>
              </div>

              <div className="p-3 rounded-xl bg-urgencia/10 border border-urgencia/30">
                <div className="flex items-center gap-2 text-urgencia font-medium mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pronto Atendimento 24 Horas</span>
                </div>
                <p className="text-xs text-stone-300">Equipe de plantão ininterrupto para casos de urgência e emergência.</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-display font-semibold text-lg mb-4">Atendimento & Endereço</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-verde-500 shrink-0 mt-0.5" />
                <span>Rua Principal, 1000 - Centro, São Paulo / SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-verde-500 shrink-0" />
                <span>(11) 99999-9999 / (11) 3333-4444</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-verde-500 shrink-0" />
                <span>contato@iddaveterinaria.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} IDDA Veterinária. Todos os direitos reservados.</p>
          <p className="text-stone-600">Desenvolvido para excelência em medicina veterinária.</p>
        </div>
      </div>
    </footer>
  )
}
