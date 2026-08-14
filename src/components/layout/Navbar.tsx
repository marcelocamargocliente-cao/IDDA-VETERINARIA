import React, { useState, useEffect } from 'react'
import { Phone, Heart, Menu, X, Lock, Calendar } from 'lucide-react'
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
      {/* TOP BAR - Info Rápida */}
      <div className="bg-[#1A1A1A] text-white py-2 px-4 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#6B8E6F] transition text-stone-200 hover:text-white"
              title="WhatsApp IDDA Veterinária"
            >
              <Phone className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span className="font-semibold">{CLINIC_CONFIG.phone.whatsappFormatted}</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-stone-400 hidden sm:inline">{CLINIC_CONFIG.hours}</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-stone-400 hover:text-[#6B8E6F] transition text-xs pl-3 border-l border-stone-800"
            title={isAdminLoggedIn ? 'Painel Administrativo' : 'Acesso Admin'}
          >
            <Lock className={`w-3 h-3 ${isAdminLoggedIn ? 'text-[#6B8E6F]' : ''}`} />
            <span>{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* MAIN HEADER */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-200 ${
        scrolled ? 'shadow-md py-2.5' : 'shadow-xs py-3 lg:py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* DESKTOP: Layout 3 Colunas Perfeitas */}
          <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] items-center gap-6 xl:gap-8">
            
            {/* COLUNA 1: Logo + Branding Compacto e Proporcional */}
            <a href="#inicio" className="flex items-center gap-2.5 min-w-0 group flex-shrink-0">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-[#6B8E6F] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#5A7A5F] transition-colors shadow-xs">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              
              {/* Texto */}
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight font-serif-heading">
                  IDDA <span className="text-[#6B8E6F] font-normal italic">Veterinária</span>
                </h1>
                <p className="text-xs text-[#4A4A4A] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {CLINIC_CONFIG.tagline}
                </p>
              </div>
            </a>

            {/* COLUNA 2: Menu Centralizado */}
            <div className="flex justify-center items-center gap-5 xl:gap-6 px-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-[#1A1A1A] hover:text-[#6B8E6F] transition-colors whitespace-nowrap py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#6B8E6F] hover:after:w-full after:transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* COLUNA 3: Botão CTA Sem Quebra */}
            <div className="flex justify-end flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#6B8E6F] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#5A7A5F] transition-all text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0 shadow-xs hover:shadow-sm transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>AGENDAR</span>
              </a>
            </div>

          </div>

          {/* MOBILE: Layout Otimizado */}
          <div className="lg:hidden flex justify-between items-center">
            
            {/* Logo Mobile */}
            <a href="#inicio" className="flex items-center gap-2 flex-1 min-w-0 pr-2">
              <div className="w-9 h-9 bg-[#6B8E6F] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                <Heart className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-[#1A1A1A] leading-tight font-serif-heading">
                  IDDA <span className="text-[#6B8E6F] font-normal italic">Vet</span>
                </h1>
                <p className="text-[11px] text-[#555555] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {CLINIC_CONFIG.tagline}
                </p>
              </div>
            </a>

            {/* CTA + Menu Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#6B8E6F] text-white px-3.5 py-2 rounded-lg font-bold text-xs whitespace-nowrap hover:bg-[#5A7A5F] transition shadow-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>AGENDAR</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1A1A1A] hover:bg-stone-100 rounded-lg transition"
                aria-label="Abrir Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#1A1A1A]" />
                )}
              </button>
            </div>

          </div>

          {/* MOBILE MENU DROPDOWN */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-3 pt-3 border-t border-gray-200 space-y-1 animate-in slide-in-from-top-1 duration-150">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 text-sm font-semibold text-[#1A1A1A] hover:text-[#6B8E6F] hover:bg-stone-50 rounded-lg transition"
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-3 border-t border-stone-200 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-center shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp: {CLINIC_CONFIG.phone.whatsappFormatted}
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenAdmin()
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium"
                >
                  <Lock className="w-3 h-3" />
                  <span>{isAdminLoggedIn ? 'Acessar Painel Admin' : 'Acesso Administrativo'}</span>
                </button>
              </div>
            </nav>
          )}

        </div>
      </nav>
    </header>
  )
}



