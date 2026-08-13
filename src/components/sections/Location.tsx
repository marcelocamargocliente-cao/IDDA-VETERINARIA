import React from 'react'
import { MapPin, Phone, Clock, Navigation, ShieldAlert, Copy, Check, Instagram, ShieldCheck } from 'lucide-react'

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
    <section id="localizacao" className="py-20 bg-[#f0faf4] border-t border-[#dcf5e7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1B7A3E] bg-[#dcf5e7] px-3.5 py-1.5 rounded-full inline-block mb-3">
            Onde Estamos & Contato
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#062614] tracking-tight mb-4">
            Venha nos visitar em Cosmos, Rio de Janeiro
          </h2>
          <p className="text-[#0F5A2C] opacity-80 text-base leading-relaxed">
            Localização de fácil acesso na Estrada do Tutóia em Cosmos, com atendimento clínico, exames e plantão 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dcf5e7] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#dcf5e7] text-[#1B7A3E] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#062614] text-lg">Endereço</h3>
                  <p className="text-[#0F5A2C] text-sm mt-1 leading-relaxed">
                    Estrada do Tutóia, 520 lj. 2<br />
                    Cosmos, Rio de Janeiro - RJ<br />
                    CEP: 23060-275
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B7A3E] hover:text-[#166633] mt-2 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1B7A3E]" />
                        <span>Copiado com sucesso!</span>
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

              {/* Phone & Emergency */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E63329]/10 text-[#E63329] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#062614] text-lg">Telefones de Atendimento</h3>
                  <div className="mt-1 space-y-1 text-sm">
                    <p>
                      WhatsApp Principal: <a href="https://wa.me/5521986260484" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1B7A3E] hover:underline">(21) 98626-0484</a>
                    </p>
                    <p>
                      Telefone Secundário: <a href="https://wa.me/5521998570710" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0F5A2C] hover:underline">(21) 99857-0710</a>
                    </p>
                  </div>
                  <p className="font-bold text-sm mt-2 text-[#E63329] flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 inline" /> Plantão 24h: (21) 98626-0484
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#dcf5e7] text-[#1B7A3E] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#062614] text-lg">Atendimento</h3>
                  <p className="text-[#0F5A2C] text-sm mt-1">
                    Pronto socorro e consultas: 24 horas por dia<br />
                    <strong className="text-[#1B7A3E]">Todos os dias, inclusive feriados</strong>
                  </p>
                </div>
              </div>

              {/* Redes & Convênio */}
              <div className="pt-3 border-t border-[#dcf5e7] flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href="https://www.instagram.com/iddaveterinaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#1B7A3E] hover:text-[#062614] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@iddaveterinaria</span>
                </a>

                <span className="inline-flex items-center gap-1 font-semibold text-[#0F5A2C] bg-[#dcf5e7] px-2.5 py-1 rounded-full text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A3E]" /> Credenciada Petlove
                </span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1B7A3E] hover:bg-[#166633] text-white py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Traçar Rota no Maps</span>
              </a>
              <a
                href={mapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#f0faf4] hover:bg-[#dcf5e7] text-[#062614] border border-[#dcf5e7] py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                <MapPin className="w-4 h-4 text-[#1B7A3E] shrink-0" />
                <span>Ver no Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Frame */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-sm border border-[#dcf5e7] min-h-[400px] flex flex-col relative group">
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-[#dcf5e7] px-3 py-1.5 rounded-xl shadow-md text-xs font-semibold text-[#062614] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B7A3E] animate-pulse" />
              <span>Estrada do Tutóia, 520 - Cosmos, RJ</span>
            </div>

            <iframe
              title="Localização IDDA Veterinária - Estrada do Tutóia 520 Cosmos, Rio de Janeiro"
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
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
