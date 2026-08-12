import React, { useState, useEffect } from 'react'
import { Phone, Heart, Menu, X, ShieldAlert, Lock, MapPin, Clock, Calendar } from 'lucide-react'

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
    { name: 'Galeria', href: '#galeria' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Localização', href: '#localizacao' },
  ]

  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner with Emergency Contact */}
      <div className="bg-stone-900 text-stone-200 text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-stone-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-verde-500" />
              Atendimento Clínico & Pronto Socorro 24h
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-verde-500" />
              Rua Principal, 1000 - Centro
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <a 
              href="tel:11999999999" 
              className="flex items-center gap-1.5 bg-urgencia/90 hover:bg-urgencia text-white px-2.5 py-0.5 rounded-full font-semibold text-xs tracking-wide transition-colors animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Urgência 24h: (11) 99999-9999
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors text-xs ml-2 pl-2 border-l border-stone-800"
              title={isAdminLoggedIn ? "Painel do Administrador" : "Acesso Administrativo"}
            >
              <Lock className={`w-3 h-3 ${isAdminLoggedIn ? 'text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'Painel Admin' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white/80 backdrop-blur-sm border-b border-stone-200/60 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-verde-500 flex items-center justify-center text-white shadow-md shadow-verde-500/20 group-hover:bg-verde-600 transition-all transform group-hover:scale-105">
              <Heart className="w-6 h-6 fill-white stroke-verde-500" />
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl text-stone-900 tracking-tight block leading-none">
                IDDA <span className="text-verde-500 font-semibold">Veterinária</span>
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-widest uppercase block mt-0.5">
                Clínica & Centro Médico 24h
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-verde-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-verde-500 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-verde-500/20 hover:shadow-lg hover:shadow-verde-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Consulta</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 mt-2 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-stone-700 hover:bg-verde-50 hover:text-verde-600 font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-verde-500 hover:bg-verde-600 text-white py-2.5 rounded-xl font-semibold text-center text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Agendar Consulta pelo WhatsApp
              </a>

              <a
                href="tel:11999999999"
                className="w-full flex items-center justify-center gap-2 bg-urgencia text-white py-2.5 rounded-xl font-semibold text-center text-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                Ligar Urgência (11) 99999-9999
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
