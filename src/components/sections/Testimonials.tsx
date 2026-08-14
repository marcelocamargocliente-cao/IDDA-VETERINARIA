import React, { useState, useEffect } from 'react'
import { Star, Quote, Heart, UserCheck } from 'lucide-react'
import { Testimonial } from '../../types'
import { supabase } from '../../lib/supabase'

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', author_name: 'Mariana Silva', pet_name: 'Thor (Golden Retriever)', rating: 5, content: 'Atendimento 24h impecável! O Thor chegou passando mal de madrugada e foi socorrido com todo carinho e competência pela equipe da IDDA.', active: true, created_at: new Date().toISOString() },
  { id: '2', author_name: 'Carlos Eduardo', pet_name: 'Mel (Gata Persa)', rating: 5, content: 'A melhor clínica de Cosmos e região. Estrutura limpa, moderna e veterinários extremamente atenciosos com os animais.', active: true, created_at: new Date().toISOString() },
  { id: '3', author_name: 'Juliana Costa', pet_name: 'Bidu (SRD)', rating: 5, content: 'Fizemos todas as vacinas e consultas de rotina do Bidu aqui. Recomendo de olhos fechados para quem ama seu pet!', active: true, created_at: new Date().toISOString() }
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
  loading?: boolean
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials: propTestimonials, loading: propLoading }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(propTestimonials || FALLBACK_TESTIMONIALS)
  const [loading, setLoading] = useState(propLoading ?? true)

  useEffect(() => {
    if (propTestimonials) {
      setTestimonials(propTestimonials)
      setLoading(false)
      return
    }

    const fetchTestimonials = async () => {
      try {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setTestimonials(data)
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()

    const channel = supabase.channel('testimonials-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchTestimonials)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [propTestimonials])

  const activeTestimonials = (testimonials || []).filter(t => t.active !== false)

  return (
    <section id="depoimentos" className="py-20 sm:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B8E6F] bg-[#F5F1ED] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9]">
            Depoimentos & Experiências
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Histórias de amor, confiança e cuidado
          </h2>
          <p className="text-[#4A4A4A] text-base leading-relaxed max-w-2xl mx-auto">
            Nada nos enche mais de orgulho do que a recuperação, alegria e o bem-estar dos nossos pacientes e a tranquilidade de suas famílias.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F5F1ED] rounded-2xl p-8 border border-[#D4C5B9] animate-pulse space-y-4">
                <div className="h-4 bg-[#D4C5B9]/60 rounded w-1/4" />
                <div className="h-16 bg-[#D4C5B9]/60 rounded w-full" />
                <div className="h-4 bg-[#D4C5B9]/60 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#F5F1ED]/50 rounded-2xl p-7 sm:p-8 hover:bg-[#FFFFFF] border border-[#D4C5B9]/70 hover:border-[#6B8E6F] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <Quote className="absolute top-4 right-4 w-12 h-12 text-[#D4C5B9]/30 pointer-events-none" />

                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (item.rating || 5) 
                            ? 'fill-[#D4A574] text-[#D4A574]' 
                            : 'fill-[#D4C5B9] text-[#D4C5B9]'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#1A1A1A] ml-2">
                      {item.rating || 5}.0
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed mb-6 italic">
                    "{item.content}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#D4C5B9]/50 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6B8E6F] text-white flex items-center justify-center font-serif-heading font-bold text-sm shadow-2xs">
                      {item.author_name ? item.author_name.charAt(0) : 'T'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm leading-tight">
                        {item.author_name}
                      </h4>
                      <p className="text-xs text-[#8B7355] font-medium flex items-center gap-1 mt-0.5">
                        <Heart className="w-3 h-3 fill-[#6B8E6F] text-[#6B8E6F]" />
                        Tutor de {item.pet_name}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#6B8E6F] bg-[#FFFFFF] px-2 py-1 rounded-full border border-[#D4C5B9] flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-[#6B8E6F]" /> Verificado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
