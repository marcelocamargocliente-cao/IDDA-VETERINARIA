import React, { useState, useEffect } from 'react'
import { Phone, Heart, Menu, X, Lock, MessageCircle, Calendar } from 'lucide-react'
import { CLINIC_CONFIG } from '../../config/constants'

interface NavbarProps {
  onOpenAdmin: () => void
  isAdminLoggedIn: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Por que IDDA', href: '#por-que-idda' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Localização', href: '#localizacao' },
  ]

  const whatsappUrl = CLINIC_CONFIG.whatsappUrl('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Bar - Telefone e Info */}
      <div className="bg-[#1A1A1A] text-white text-xs py-2 px-4 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-[#6B8E6F] transition-colors font-medium"
              title="Agendamentos via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>{CLINIC_CONFIG.phone.whatsappFormatted}</span>
            </a>
            
            <a 
              href={`tel:${CLINIC_CONFIG.phone.contactClean}`}
              className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
              title="Telefone de Contato"
            >
              <Phone className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>{CLINIC_CONFIG.phone.contact}</span>
            </a>

            <span className="text-stone-600 hidden md:inline">•</span>
            <span className="hidden md:inline text-stone-300 font-light">
              {CLINIC_CONFIG.hours}
            </span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-xs pl-3 border-l border-stone-800"
            title={isAdminLoggedIn ? 'Painel Administrativo' : 'Acesso Administrativo'}
          >
            <Lock className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-[#6B8E6F]' : ''}`} />
            <span>{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-md py-3 border-b border-stone-200' 
          : 'bg-white shadow-sm py-4 border-b border-stone-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            
            {/* Logo + Branding */}
            <a href="#inicio" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-[#6B8E6F] rounded-xl flex items-center justify-center shadow-sm group-hover:bg-[#5A7A5F] transition-colors shrink-0">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl xl:text-2xl font-bold text-[#1A1A1A] leading-tight font-serif-heading">
                  IDDA <span className="text-[#6B8E6F] font-normal italic">Veterinária</span>
                </h1>
                <p className="text-xs text-[#555555] font-medium leading-tight mt-0.5">
                  {CLINIC_CONFIG.tagline}
                </p>
              </div>
            </a>

            {/* Nav Links Center */}
            <div className="flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[#1A1A1A] font-semibold hover:text-[#6B8E6F] transition-colors text-sm py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#6B8E6F] hover:after:w-full after:transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#6B8E6F] text-white px-5 py-2.5 xl:px-6 xl:py-3 rounded-xl font-bold hover:bg-[#5A7A5F] transition-all flex items-center gap-2 shadow-sm hover:shadow-md text-xs uppercase tracking-wider whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>AGENDAR AGORA</span>
            </a>

          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden flex justify-between items-center">
            
            {/* Logo Compacto */}
            <a href="#inicio" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#6B8E6F] rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight font-serif-heading">
                  IDDA <span className="text-[#6B8E6F] font-normal italic">Veterinária</span>
                </h1>
                <p className="text-[11px] text-[#666666] font-medium leading-none">
                  Saúde Animal com Amor
                </p>
              </div>
            </a>

            {/* Mobile Actions: CTA + Menu Toggle */}
            <div className="flex items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#6B8E6F] text-white px-3.5 py-2 rounded-lg font-bold hover:bg-[#5A7A5F] transition text-xs whitespace-nowrap flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A1A1A] hover:bg-stone-100 rounded-lg transition"
                aria-label="Abrir Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#1A1A1A]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#1A1A1A]" />
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[#1A1A1A] hover:bg-[#F5F1ED] hover:text-[#6B8E6F] font-semibold text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: {CLINIC_CONFIG.phone.whatsappFormatted}
              </a>

              <a
                href={`tel:${CLINIC_CONFIG.phone.contactClean}`}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center"
              >
                <Phone className="w-4 h-4 text-[#6B8E6F]" />
                Ligar: {CLINIC_CONFIG.phone.contact}
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenAdmin()
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-stone-500 hover:text-stone-800 text-xs font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Acessar Painel Admin' : 'Acesso Administrativo'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}



