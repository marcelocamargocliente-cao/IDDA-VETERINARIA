import React from 'react'
import { Star, Quote, Heart, UserCheck } from 'lucide-react'
import { Testimonial } from '../../types'

interface TestimonialsProps {
  testimonials: Testimonial[]
  loading?: boolean
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, loading }) => {
  const activeTestimonials = testimonials.filter(t => t.active)

  return (
    <section id="depoimentos" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-verde-600 bg-verde-100 px-3 py-1 rounded-full inline-block mb-3">
            Avaliações de Tutores
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
            A opinião de quem confia na IDDA Veterinária
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Nada nos enche mais de orgulho do que ver a recuperação, alegria e saúde dos nossos pacientes de quatro patas.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 animate-pulse space-y-4">
                <div className="h-4 bg-stone-200 rounded w-1/4" />
                <div className="h-16 bg-stone-200 rounded w-full" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all border border-stone-200/80 flex flex-col justify-between relative overflow-hidden"
              >
                <Quote className="absolute top-4 right-4 w-12 h-12 text-stone-100/80 -z-0 pointer-events-none" />

                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-stone-500 ml-2">
                      {item.rating}.0
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                    "{item.content}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-verde-100 text-verde-700 flex items-center justify-center font-bold text-sm">
                      {item.author_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm leading-none mb-1">
                        {item.author_name}
                      </h4>
                      <p className="text-xs text-verde-600 font-medium flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-verde-500 text-verde-500" />
                        Tutor de {item.pet_name}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Verificado
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
