import React from 'react'
import { Heart, MapPin, Phone, Clock, ArrowUpRight, Instagram, ShieldCheck, Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  const whatsappMessage = encodeURIComponent('Olá! Vim pelo site da IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <footer className="bg-[#1A1A1A] text-[#D4C5B9] pt-16 pb-10 border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6B8E6F] flex items-center justify-center text-white shadow-sm">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-2xl text-white tracking-tight block">
                  IDDA <span className="text-[#6B8E6F] font-normal italic">Veterinária</span>
                </span>
                <span className="text-[10px] text-[#D4C5B9]/70 font-medium tracking-widest uppercase block">
                  Cuidado & Saúde Animal
                </span>
              </div>
            </div>

            <p className="text-[#888888] text-sm leading-relaxed">
              Dedicados ao cuidado humanizado, longevidade e medicina veterinária de alta qualidade para o seu pet em Cosmos, Rio de Janeiro.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B8E6F] hover:text-white transition-colors"
              >
                Falar com a Recepção <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/iddaveterinaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#888888] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#6B8E6F]" />
                <span>@iddaveterinaria</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif-heading font-bold text-lg mb-4">Navegação</h3>
            <ul className="space-y-2.5 text-sm text-[#888888]">
              <li>
                <a href="#hero" className="hover:text-[#6B8E6F] transition-colors">Início</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#6B8E6F] transition-colors">Nossos Serviços</a>
              </li>
              <li>
                <a href="#por-que-idda" className="hover:text-[#6B8E6F] transition-colors">Por Que Escolher a IDDA</a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-[#6B8E6F] transition-colors">Diferenciais Clínicos</a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#6B8E6F] transition-colors">Nossa Estrutura</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-[#6B8E6F] transition-colors">Depoimentos de Tutores</a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-[#6B8E6F] transition-colors">Onde Estamos</a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-white font-serif-heading font-bold text-lg mb-4">Atendimento</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-[#242424] rounded-xl p-4 border border-[#333333]">
                <p className="font-semibold text-white">Consultas & Exames</p>
                <p className="text-[#888888] text-xs mt-0.5">Segunda a Domingo com agendamento</p>
              </div>
              
              <div className="bg-[#242424] rounded-xl p-4 border border-[#6B8E6F]/40 mt-2">
                <p className="font-semibold text-[#6B8E6F] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#6B8E6F]" /> Plantão Veterinário
                </p>
                <p className="text-[#888888] text-xs mt-0.5">Atendimento contínuo para seu pet</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-serif-heading font-bold text-lg mb-4">Endereço & Contato</h3>
            <ul className="space-y-3 text-sm text-[#888888]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6B8E6F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#D4C5B9]">Estrada do Tutóia, 520 lj. 2</p>
                  <p className="text-xs text-[#888888]">Cosmos, Rio de Janeiro - RJ, 23060-275</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#6B8E6F] shrink-0" />
                <span className="text-[#D4C5B9]">(21) 98626-0484</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 font-medium text-xs text-[#6B8E6F] bg-[#242424] px-3 py-1.5 rounded-lg border border-[#333333]">
                  <ShieldCheck className="w-4 h-4" /> Clínica Credenciada Petlove
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] gap-4">
          <p>© {new Date().getFullYear()} IDDA Veterinária. Todos os direitos reservados.</p>
          <p className="text-[#888888]">Estrada do Tutóia, 520 - Cosmos, Rio de Janeiro - RJ</p>
        </div>
      </div>
    </footer>
  )
}

