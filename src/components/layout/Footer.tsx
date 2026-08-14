import React from 'react'
import { Heart, MapPin, Phone, Clock, ArrowUpRight, Instagram, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'
import { CLINIC_CONFIG } from '../../config/constants'

export const Footer: React.FC = () => {
  const whatsappUrl = CLINIC_CONFIG.whatsappUrl('Olá! Vim pelo site da IDDA Veterinária.')

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
                  {CLINIC_CONFIG.tagline}
                </span>
              </div>
            </div>

            <p className="text-[#888888] text-sm leading-relaxed">
              Dedicados ao cuidado humanizado, longevidade e medicina veterinária de alta qualidade para o seu pet em Cosmos, Rio de Janeiro.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B8E6F] hover:text-white transition-colors"
              >
                Falar com a Recepção <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={CLINIC_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#888888] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#6B8E6F]" />
                <span>{CLINIC_CONFIG.social.instagram}</span>
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
                <p className="text-[#888888] text-xs mt-0.5">{CLINIC_CONFIG.hoursDetail}</p>
              </div>
              
              <div className="bg-[#242424] rounded-xl p-4 border border-[#6B8E6F]/40 mt-2">
                <p className="font-semibold text-[#6B8E6F] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#6B8E6F]" /> {CLINIC_CONFIG.hours}
                </p>
                <p className="text-[#888888] text-xs mt-0.5">Atendimento contínuo e dedicado para seu pet</p>
              </div>
            </div>
          </div>

          {/* Contact Details with BOTH phones */}
          <div>
            <h3 className="text-white font-serif-heading font-bold text-lg mb-4">Contato & Endereço</h3>
            <ul className="space-y-3.5 text-sm text-[#888888]">
              {/* WhatsApp */}
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#6B8E6F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-[#888888] block">WhatsApp / Agendamentos:</span>
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6B8E6F] font-bold hover:underline text-sm"
                  >
                    {CLINIC_CONFIG.phone.whatsappFormatted}
                  </a>
                </div>
              </li>

              {/* Telefone de Contato */}
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#6B8E6F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-[#888888] block">Telefone de Contato:</span>
                  <a 
                    href={`tel:${CLINIC_CONFIG.phone.contactClean}`}
                    className="text-white font-semibold hover:text-[#6B8E6F] transition-colors text-sm"
                  >
                    {CLINIC_CONFIG.phone.contact}
                  </a>
                </div>
              </li>

              {/* Endereço */}
              <li className="flex items-start gap-3 pt-1">
                <MapPin className="w-5 h-5 text-[#6B8E6F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#D4C5B9] font-medium leading-snug">{CLINIC_CONFIG.address.street}</p>
                  <p className="text-xs text-[#888888]">{CLINIC_CONFIG.address.neighborhood}, {CLINIC_CONFIG.address.city} - {CLINIC_CONFIG.address.state}, CEP {CLINIC_CONFIG.address.cep}</p>
                </div>
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
          <p>© {new Date().getFullYear()} {CLINIC_CONFIG.name}. Todos os direitos reservados.</p>
          <p className="text-[#888888]">{CLINIC_CONFIG.address.full}</p>
        </div>
      </div>
    </footer>
  )
}


