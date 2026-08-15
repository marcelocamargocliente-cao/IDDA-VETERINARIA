import React, { useState, useEffect } from 'react'
import { imgPresets } from '../../lib/imageUtils'
import { CLINIC_CONFIG } from '../../config/constants'
import { supabase } from '../../lib/supabase'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Copy, 
  Check, 
  Instagram, 
  ShieldCheck, 
  Car, 
  Compass, 
  MessageCircle, 
  CheckCircle2 
} from 'lucide-react'

export const Location: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [locationImage, setLocationImage] = useState('https://images.pexels.com/photos/5998473/pexels-photo-5998473.jpeg?w=800')
  const [locationCaption, setLocationCaption] = useState('')

  useEffect(() => {
    const fetchLocationImg = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'location_image').single()
        if (data?.value) setLocationImage(data.value)
        const { data: capData } = await supabase.from('site_settings').select('value').eq('key', 'location_caption').single()
        if (capData?.value) setLocationCaption(capData.value)
      } catch (e) {
        console.error('Error loading location image:', e)
      }
    }
    fetchLocationImg()

    const channel = supabase.channel('location-settings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload: any) => {
        if (payload.new?.key === 'location_image') {
          setLocationImage(payload.new.value)
        }
        if (payload.new?.key === 'location_caption') {
          setLocationCaption(payload.new.value)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fullAddress = CLINIC_CONFIG.address.full

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mapsDirections = CLINIC_CONFIG.address.mapsUrl
  const wazeDirections = "https://waze.com/ul?q=Estrada%20do%20Tut%C3%B3ia%20520%20Cosmos%20Rio%20de%20Janeiro"

  return (
    <section id="localizacao" className="py-20 sm:py-24 bg-[#F5F1ED] border-t border-[#D4C5B9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B7355] bg-[#FFFFFF] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9] shadow-2xs">
            Onde Estamos & Visitas
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Venha nos visitar em {CLINIC_CONFIG.address.neighborhood}, {CLINIC_CONFIG.address.state}
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Estrutura planejada na {CLINIC_CONFIG.address.street}, de fácil acesso e estacionamento, pronta para receber você e seu pet com carinho e conforto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-6 bg-[#FFFFFF] rounded-3xl p-7 sm:p-9 shadow-sm border border-[#D4C5B9]/70 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Endereço da Clínica</h3>
                  <p className="text-[#4A4A4A] text-sm mt-1 leading-relaxed">
                    {CLINIC_CONFIG.address.street}<br />
                    {CLINIC_CONFIG.address.neighborhood} — {CLINIC_CONFIG.address.city}, {CLINIC_CONFIG.address.state}<br />
                    <span className="text-xs text-[#8B7355] font-semibold">CEP: {CLINIC_CONFIG.address.cep}</span>
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B8E6F] hover:text-[#5A7A5F] mt-2.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#6B8E6F]" />
                        <span>Endereço copiado para a área de transferência!</span>
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

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Telefones & Atendimento</h3>
                  <div className="mt-1 space-y-2 text-sm text-[#4A4A4A]">
                    <div>
                      <span className="text-xs text-[#888888] block">WhatsApp / Agendamentos:</span>
                      <a 
                        href={CLINIC_CONFIG.whatsappUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-[#6B8E6F] hover:underline text-base"
                      >
                        {CLINIC_CONFIG.phone.whatsappFormatted}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">Telefone de Contato:</span>
                      <a 
                        href={`tel:${CLINIC_CONFIG.phone.contactClean}`} 
                        className="font-semibold text-[#1A1A1A] hover:text-[#6B8E6F] text-base"
                      >
                        {CLINIC_CONFIG.phone.contact}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F1ED] border border-[#D4C5B9] text-[#6B8E6F] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-[#1A1A1A] text-lg">Horários de Atendimento</h3>
                  <p className="text-[#4A4A4A] text-sm mt-1 leading-relaxed">
                    {CLINIC_CONFIG.hoursDetail}<br />
                    <strong className="text-[#6B8E6F] font-bold">{CLINIC_CONFIG.hours}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F5F1ED] flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={CLINIC_CONFIG.social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#6B8E6F] hover:text-[#1A1A1A] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{CLINIC_CONFIG.social.instagram}</span>
                </a>

                <span className="inline-flex items-center gap-1.5 font-semibold text-[#8B7355] bg-[#F5F1ED] px-3.5 py-1.5 rounded-full text-xs border border-[#D4C5B9]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B8E6F]" /> Clínica Credenciada Petlove
                </span>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all text-center"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Traçar Rota no Google Maps</span>
              </a>

              <a
                href={wazeDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#F5F1ED] hover:bg-[#D4C5B9]/40 text-[#1A1A1A] border border-[#D4C5B9] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                <Compass className="w-4 h-4 text-[#6B8E6F] shrink-0" />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
            <div className="bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-sm border border-[#D4C5B9]/70 group relative">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#1A1A1A]">
                <img
                  src={imgPresets.location(locationImage)}
                  alt="Estrutura e Acolhimento IDDA Veterinária"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.src = locationImage }}
                />
                {locationCaption && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <h4 className="font-serif-heading text-xl font-bold drop-shadow-md">
                        {locationCaption}
                      </h4>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-3xl p-7 sm:p-8 shadow-sm border border-[#D4C5B9]/70 space-y-4">
              <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                <Car className="w-5 h-5 text-[#6B8E6F]" />
                <span>Facilidades de Acesso & Chegada</span>
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-[#4A4A4A]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E6F] shrink-0 mt-0.5" />
                  <span><strong>Fácil Estacionamento:</strong> Vagas em frente à clínica para embarque e desembarque seguro do seu pet.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E6F] shrink-0 mt-0.5" />
                  <span><strong>Localização Privilegiada:</strong> Situada na {CLINIC_CONFIG.address.street}, próximo aos principais eixos viários de Cosmos e Paciência.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6B8E6F] shrink-0 mt-0.5" />
                  <span><strong>Ambiente Climatizado & Acessível:</strong> Recepção e consultórios preparados para cães e gatos de todos os portes.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F5F1ED]">
                <a
                  href={CLINIC_CONFIG.whatsappUrl('Olá, gostaria de ajuda com a localização e estacionamento da clínica.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F1ED] hover:bg-[#6B8E6F] text-[#1A1A1A] hover:text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#6B8E6F] group-hover:text-white" />
                  <span>Precisa de ajuda com o caminho? Fale no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
