import React from 'react'
import { MapPin, Phone, Clock, Navigation, Copy, Check, Instagram, ShieldCheck, Sparkles } from 'lucide-react'

export const Location: React.FC = () => {
  const [copied, setCopied] = React.useState(false)

  const fullAddress = "Estrada do Tutóia, 520 lj. 2 - Cosmos, Rio de Janeiro - RJ, CEP: 23060-275"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mapsPlaceUrl = "https://www.google.com/maps/place/Estrada+do+Tut%C3%B3ia,+520+-+Cosmos,+Rio+de+Janeiro,+RJ"
  const mapsDirections = "https://www.google.com/maps/dir/?api=1&destination=Estrada+do+Tut%C3%B3ia,+520+-+Cosmos,+Rio+de+Janeiro+-+RJ+23060-275"
  const mapsEmbedUrl = "https://maps.google.com/maps?q=Estrada+do+Tut%C3%B3ia%2C+520%2C+Cosmos%2C+Rio+de+Janeiro+-+RJ%2C+23060-275&t=&z=16&ie=UTF8&iwloc=&output=embed"

  return (
    <section id="localizacao" className="py-20 sm:py-24 bg-[#F5F1ED] border-t border-[#D4C5B9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B7355] bg-[#FFFFFF] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9] shadow-2xs">
            Onde Estamos & Visitas
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Venha nos visitar em Cosmos, RJ
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Localização de fácil acesso na Estrada do Tutóia, preparada para receber você e seu pet com carinho e conforto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl p-7 sm:p-8 shadow-sm border border-[#D4C5B9]/70 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Endereço</h3>
                  <p className="text-[#4A4A4A] text-sm mt-1 leading-relaxed">
                    Estrada do Tutóia, 520 lj. 2<br />
                    Cosmos, Rio de Janeiro - RJ<br />
                    CEP: 23060-275
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B8E6F] hover:text-[#5A7A5F] mt-2 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#6B8E6F]" />
                        <span>Endereço copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar endereço completo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Telefones & WhatsApp</h3>
                  <div className="mt-1 space-y-1 text-sm text-[#4A4A4A]">
                    <p>
                      WhatsApp Principal: <a href="https://wa.me/5521986260484" target="_blank" rel="noopener noreferrer" className="font-bold text-[#6B8E6F] hover:underline">(21) 98626-0484</a>
                    </p>
                    <p>
                      Telefone / Plantão: <a href="tel:21998570710" className="font-semibold text-[#1A1A1A] hover:underline">(21) 99857-0710</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Horários de Atendimento</h3>
                  <p className="text-[#4A4A4A] text-sm mt-1">
                    Atendimento e consultas todos os dias.<br />
                    <strong className="text-[#6B8E6F] font-semibold">Plantão veterinário contínuo</strong>
                  </p>
                </div>
              </div>

              {/* Social & Credencial */}
              <div className="pt-4 border-t border-[#F5F1ED] flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href="https://www.instagram.com/iddaveterinaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#6B8E6F] hover:text-[#1A1A1A] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@iddaveterinaria</span>
                </a>

                <span className="inline-flex items-center gap-1 font-semibold text-[#8B7355] bg-[#F5F1ED] px-3 py-1 rounded-full text-xs border border-[#D4C5B9]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B8E6F]" /> Credenciada Petlove
                </span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Traçar Rota no Maps</span>
              </a>
              <a
                href={mapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#F5F1ED] hover:bg-[#D4C5B9]/40 text-[#1A1A1A] border border-[#D4C5B9] py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                <MapPin className="w-4 h-4 text-[#6B8E6F] shrink-0" />
                <span>Ver no Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Frame */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm border border-[#D4C5B9]/70 min-h-[400px] flex flex-col relative group">
            <div className="absolute top-4 left-4 z-10 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#D4C5B9] px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#1A1A1A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6B8E6F] animate-pulse" />
              <span>Estrada do Tutóia, 520 - Cosmos, RJ</span>
            </div>

            <iframe
              title="Localização IDDA Veterinária - Estrada do Tutóia 520 Cosmos, Rio de Janeiro"
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

        </div>

      </div>
    </section>
  )
}

