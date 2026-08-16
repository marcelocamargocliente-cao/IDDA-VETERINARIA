import React, { useEffect, useState, useRef } from 'react'
import { imgPresets } from '../../lib/imageUtils'
import { Calendar, ArrowRight, Sparkles, Star } from 'lucide-react'
import { CLINIC_CONFIG } from '../../config/constants'
import { supabase } from '../../lib/supabase'
import defaultHeroDogImage from '../../assets/images/idda_hero_horizontal_16_9_1786671030992.jpg'

// ── Hook: contador animado ──────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ── Hook: texto digitando ───────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [typing, setTyping] = useState(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const current = words[wordIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed)
      } else {
        timeout = setTimeout(() => setTyping(false), pause)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2)
      } else {
        setWordIdx((i) => (i + 1) % words.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, wordIdx, words, speed, pause])

  return displayed
}

// ── Hook: observar quando entra na tela ────────────────────────────
function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

export const Hero: React.FC = () => {
  const [heroUrl, setHeroUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef as React.RefObject<Element>)

  // Contadores animados
  const pets    = useCounter(10000, 2000, inView)
  const servicos = useCounter(6, 1200, inView)
  const nota    = useCounter(50, 1500, inView) // 50 = 5.0

  // Texto digitando
  const typed = useTypewriter([
    'Amor que ele reconhece.',
    'Cuidado que ele merece.',
    'Saúde em boas mãos.',
  ])

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image').single()
        if (data?.value) setHeroUrl(data.value)
      } catch (e) {
        console.error('Error loading hero image:', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHero()

    const channel = supabase.channel('hero-settings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, (payload: any) => {
        if (payload.new?.key === 'hero_image') setHeroUrl(payload.new.value)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const imageUrl = heroUrl || defaultHeroDogImage
  const whatsappUrl = CLINIC_CONFIG.whatsappUrl('Olá! Gostaria de agendar uma consulta na IDDA Veterinária.')

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative pt-24 pb-12 md:pt-28 md:pb-20 overflow-hidden bg-[#F5F1ED]"
    >
      {/* ── Fundo com gradiente animado ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] rounded-full bg-[#D4C5B9]/40 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[500px] h-[500px] rounded-full bg-[#6B8E6F]/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        {/* Partículas flutuantes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#6B8E6F]/30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDuration: `${3 + i * 0.7}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* ── Coluna de texto ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#D4C5B9] text-[#8B7355] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-2xs transition-all duration-700"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '0ms' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6B8E6F]" />
              <span>Cuidado Veterinário Premium</span>
            </div>

            {/* Headline com typewriter */}
            <h1
              className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.03em] transition-all duration-700"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '100ms' }}
            >
              Saúde que seu pet merece. <br />
              <span className="italic text-[#6B8E6F] font-normal">
                {typed}
                <span className="inline-block w-0.5 h-[0.9em] bg-[#6B8E6F] ml-0.5 align-middle animate-blink" />
              </span>
            </h1>

            {/* Subtítulo */}
            <p
              className="text-[#4A4A4A] text-base sm:text-lg leading-[1.6] max-w-xl font-normal transition-all duration-700"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}
            >
              Combinamos tecnologia de ponta com atendimento humanizado. Porque seu pet não é só animal de estimação — <strong className="text-[#1A1A1A] font-semibold">é família</strong>.
            </p>

            {/* Botões com hover animado */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 transition-all duration-700"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '300ms' }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#6B8E6F] text-white px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:bg-[#5A7A5F] hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Agora</span>
              </a>

              <a
                href="#servicos"
                className="flex items-center justify-center gap-2 border-2 border-[#6B8E6F] text-[#6B8E6F] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-[#6B8E6F] hover:text-white hover:-translate-y-1 hover:shadow-md active:translate-y-0"
              >
                <span>Conhecer Serviços</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Contadores animados */}
            <div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D4C5B9]/60 max-w-lg transition-all duration-700"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-serif-heading tabular-nums">
                  {pets >= 10000 ? '10k+' : pets >= 1000 ? `${(pets / 1000).toFixed(1)}k` : pets}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Pets Felizes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] font-serif-heading tabular-nums">
                  {servicos}+
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Serviços Clínicos</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#6B8E6F] font-serif-heading flex items-center gap-1 tabular-nums">
                  <span>{(nota / 10).toFixed(1)}</span>
                  <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#888888] mt-0.5">Avaliação Google</div>
              </div>
            </div>
          </div>

          {/* ── Foto com parallax e hover ── */}
          <div
            className="lg:col-span-5 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(40px)', transitionDelay: '200ms' }}
          >
            <div className="p-3 sm:p-4 bg-[#D4C5B9]/60 rounded-3xl shadow-lg border border-[#D4C5B9] transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm h-80 sm:h-96 lg:h-[420px] group">
                {isLoading ? (
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-stone-400 text-sm font-medium">Carregando foto...</span>
                  </div>
                ) : (
                  <img
                    src={imgPresets.hero(imageUrl) || imageUrl}
                    alt="Golden Retriever em frente à Clínica IDDA Veterinária"
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = defaultHeroDogImage }}
                    className="w-full h-full object-cover object-center transition-transform duration-[1.2s] ease-out group-hover:scale-110 hero-parallax"
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
