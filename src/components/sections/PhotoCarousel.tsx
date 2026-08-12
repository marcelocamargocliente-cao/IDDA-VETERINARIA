import React, { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, X } from 'lucide-react'
import { Photo } from '../../types'

interface PhotoCarouselProps {
  photos: Photo[]
  loading?: boolean
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos, loading }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gallery' | 'service' | 'hero'>('all')
  const [activeModalPhoto, setActiveModalPhoto] = useState<Photo | null>(null)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const filteredPhotos = photos.filter(p => {
    if (selectedCategory === 'all') return true
    return p.category === selectedCategory
  })

  return (
    <section id="galeria" className="py-20 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-verde-600 bg-verde-100 px-3 py-1 rounded-full inline-block mb-3">
              Conheça Nossas Instalações
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Galeria e Estrutura da Clínica
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Ambientes climatizados, equipamentos modernos e recepção acolhedora preparada para oferecer máximo conforto aos animais e seus tutores.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Todas as Fotos' },
              { id: 'gallery', label: 'Estrutura & Clínica' },
              { id: 'service', label: 'Equipamentos & Exames' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-verde-600 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-2xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-500">
            <ImageIcon className="w-12 h-12 mx-auto text-stone-300 mb-2" />
            <p className="font-medium">Nenhuma foto cadastrada nesta categoria.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Embla Viewport */}
            <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
              <div className="flex -ml-4">
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                  >
                    <div 
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                      onClick={() => setActiveModalPhoto(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Caption & Zoom Icon */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-verde-400 bg-verde-950/80 px-2 py-0.5 rounded backdrop-blur-sm border border-verde-500/30 inline-block mb-1">
                            {photo.category === 'gallery' ? 'Estrutura' : photo.category === 'service' ? 'Equipamentos' : 'Clínica'}
                          </span>
                          <p className="text-xs sm:text-sm font-medium line-clamp-2 text-stone-200">
                            {photo.caption}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:bg-verde-500 transition-colors">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-verde-500 hover:text-white transition-all z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-verde-500 hover:text-white transition-all z-10"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Modal Lightbox */}
        {activeModalPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveModalPhoto(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-urgencia transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] bg-black">
                <img
                  src={activeModalPhoto.url}
                  alt={activeModalPhoto.caption}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-stone-900 text-white border-t border-stone-800">
                <h4 className="font-display font-semibold text-lg mb-1">{activeModalPhoto.caption}</h4>
                <p className="text-xs text-stone-400">IDDA Veterinária - Instalações & Cuidados</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
