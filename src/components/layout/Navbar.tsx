import React, { useState, useEffect } from 'react'
import { Phone, Heart, Menu, X, Lock, MapPin, Clock, Calendar, MessageCircle } from 'lucide-react'

interface NavbarProps {
  onOpenAdmin: () => void
  isAdminLoggedIn: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Por que a IDDA', href: '#por-que-idda' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Localização', href: '#localizacao' },
  ]

  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5521986260484?text=${whatsappMessage}`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Notification / Info Bar */}
      <div className="bg-[#1A1A1A] text-[#F5F1ED] text-xs py-2 px-4 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6 text-[#D4C5B9]">
            <span className="flex items-center gap-1.5 font-medium text-xs">
              <Clock className="w-3.5 h-3.5 text-[#6B8E6F]" />
              Atendimento e Plantão Veterinário
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-xs text-[#D4C5B9]/80">
              <MapPin className="w-3.5 h-3.5 text-[#6B8E6F]" />
              Estrada do Tutóia, 520 lj. 2 - Cosmos, RJ
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F5F1ED] hover:text-[#6B8E6F] font-semibold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>(21) 98626-0484</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#888888] hover:text-[#F5F1ED] transition-colors text-xs pl-3 border-l border-[#333333]"
              title={isAdminLoggedIn ? "Painel Administrativo" : "Acesso Admin"}
            >
              <Lock className={`w-3 h-3 ${isAdminLoggedIn ? 'text-[#6B8E6F]' : ''}`} />
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#D4C5B9]/50' 
          : 'bg-[#F5F1ED]/90 backdrop-blur-sm border-b border-[#D4C5B9]/40 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6B8E6F] flex items-center justify-center text-white shadow-sm group-hover:bg-[#5A7A5F] transition-all">
              <Heart className="w-5 h-5 fill-white stroke-[#6B8E6F]" />
            </div>
            <div>
              <span className="font-serif-heading font-bold text-xl sm:text-2xl text-[#1A1A1A] tracking-tight block leading-none">
                IDDA <span className="text-[#6B8E6F] font-normal italic">Veterinária</span>
              </span>
              <span className="text-[10px] text-[#888888] font-semibold tracking-widest uppercase block mt-1">
                Cuidado & Saúde Animal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A4A4A]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#6B8E6F] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#6B8E6F] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Agora</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1A1A1A] hover:bg-[#D4C5B9]/30 transition-colors"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border-b border-[#D4C5B9] px-4 pt-3 pb-6 space-y-3 mt-2 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-[#1A1A1A] hover:bg-[#F5F1ED] hover:text-[#6B8E6F] font-medium text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[#D4C5B9]/60 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-center shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                Agendar Agora pelo WhatsApp
              </a>
              <a
                href="tel:21986260484"
                className="w-full flex items-center justify-center gap-2 bg-[#F5F1ED] hover:bg-[#D4C5B9]/40 text-[#1A1A1A] py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-center"
              >
                <Phone className="w-4 h-4 text-[#6B8E6F]" />
                Ligar: (21) 98626-0484
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

