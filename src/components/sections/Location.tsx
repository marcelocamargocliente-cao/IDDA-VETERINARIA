import React from 'react'
import { MapPin, Phone, Mail, Clock, Navigation, ShieldAlert, Copy, Check } from 'lucide-react'

export const Location: React.FC = () => {
  const [copied, setCopied] = React.useState(false)

  const fullAddress = "Rua Principal, 1000 - Centro, São Paulo - SP, CEP 01000-000"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("IDDA Veterinaria Rua Principal 1000 Centro")}`

  return (
    <section id="localizacao" className="py-20 bg-stone-100/80 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-verde-600 bg-verde-100 px-3 py-1 rounded-full inline-block mb-3">
            Onde Estamos & Contato
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            Venha nos visitar ou entre em contato
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Localização de fácil acesso no centro da cidade, com estacionamento privativo e recepção adaptada para o seu pet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">Endereço</h3>
                  <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                    Rua Principal, 1000 - Centro<br />
                    São Paulo / SP - CEP 01000-000
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-verde-600 hover:text-verde-700 mt-2 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
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
                <div className="w-12 h-12 rounded-2xl bg-urgencia/10 text-urgencia flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">Telefones de Atendimento</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Central: <a href="tel:1133334444" className="font-semibold text-stone-800 hover:underline">(11) 3333-4444</a>
                  </p>
                  <p className="text-stone-900 font-bold text-sm mt-1 text-urgencia flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 inline" /> Urgência 24h: (11) 99999-9999
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">E-mail</h3>
                  <a href="mailto:contato@iddaveterinaria.com.br" className="text-stone-600 hover:text-verde-600 text-sm mt-1 block">
                    contato@iddaveterinaria.com.br
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">Atendimento Clínico</h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Consultas Agendadas: Seg a Sáb das 08h às 20h<br />
                    <strong>Plantão de Emergência: 24 horas todos os dias</strong>
                  </p>
                </div>
              </div>

            </div>

            {/* Direction Route Button */}
            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white py-3.5 rounded-2xl font-semibold text-sm shadow-md transition-all"
            >
              <Navigation className="w-4 h-4 text-verde-400" />
              <span>Abrir no Google Maps & Tracar Rota</span>
            </a>
          </div>

          {/* Interactive Map Frame */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 min-h-[380px] flex flex-col relative">
            <iframe
              title="Mapa de Localização IDDA Veterinária"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.106692723652!2d-46.65431!3d-23.56311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDMzJzQ3LjIiUyA0NsKwMzknMTU1LjUiVw!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full"
            />
          </div>

        </div>

      </div>
    </section>
  )
}
