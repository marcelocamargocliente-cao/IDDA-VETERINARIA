import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, X } from 'lucide-react'
import { imgPresets } from '@/lib/imageUtils'
import { Photo } from '../../types'
import { supabase } from '../../lib/supabase'

const FALLBACK_PHOTOS: Photo[] = [
  { id:'f1', url:'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg?w=800', caption:'Atendimento de urgência 24h', category:'gallery', order:1, created_at: new Date().toISOString() },
  { id:'f2', url:'https://images.pexels.com/photos/5998473/pexels-photo-5998473.jpeg?w=800', caption:'Consultas clínicas especializadas', category:'gallery', order:2, created_at: new Date().toISOString() },
  { id:'f3', url:'https://images.pexels.com/photos/7470754/pexels-photo-7470754.jpeg?w=800', caption:'Bloco cirúrgico moderno', category:'service', order:3, created_at: new Date().toISOString() },
  { id:'f4', url:'https://images.pexels.com/photos/6235022/pexels-photo-6235022.jpeg?w=800', caption:'Vacinação e imunização', category:'service', order:4, created_at: new Date().toISOString() },
  { id:'f5', url:'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?w=800', caption:'Exames laboratoriais', category:'gallery', order:5, created_at: new Date().toISOString() },
  { id:'f6', url:'https://images.pexels.com/photos/5998465/pexels-photo-5998465.jpeg?w=800', caption:'Diagnóstico por imagem', category:'gallery', order:6, created_at: new Date().toISOString() },
]

export const PhotoCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gallery' | 'service' | 'hero'>('all')
  const [activeModalPhoto, setActiveModalPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase.from('photos').select('*').order('order')
        if (data && data.length > 0) {
          setPhotos(data)
        }
      } catch (err) {
        console.error('Error fetching photos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()

    const channel = supabase.channel('photos-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, fetchPhotos)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
    <section id="galeria" className="py-20 sm:py-24 bg-[#F5F1ED] overflow-hidden border-t border-[#D4C5B9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B7355] bg-[#FFFFFF] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9] shadow-2xs">
              Conheça Nossa Estrutura
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              A IDDA em ação — <br className="hidden sm:inline" />
              <span className="italic text-[#6B8E6F] font-normal">Momentos de cuidado e amor</span>
            </h2>
            <p className="text-[#4A4A4A] text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Ambientes climatizados, equipamentos modernos e uma recepção acolhedora preparada para oferecer máximo conforto aos animais e seus tutores.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'gallery', label: 'Estrutura' },
              { id: 'service', label: 'Procedimentos' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#6B8E6F] text-white shadow-sm'
                    : 'bg-[#FFFFFF] text-[#6B6B6B] hover:bg-[#D4C5B9]/40 border border-[#D4C5B9]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#D4C5B9]/30 animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#D4C5B9] text-[#888888]">
            <ImageIcon className="w-12 h-12 mx-auto text-[#D4C5B9] mb-2" />
            <p className="font-medium">Nenhuma foto cadastrada nesta categoria.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex -ml-4">
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                  >
                    <div 
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1A1A] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D4C5B9]"
                      onClick={() => setActiveModalPhoto(photo)}
                    >
                      <img
                        src={imgPresets.galleryThumb(photo.url)}
                        alt={photo.caption || 'Foto IDDA'}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = photo.url }}
                      />
                      
                      {/* Overlay + legenda — só aparece se tiver caption */}
                      {photo.caption ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-xs font-semibold leading-snug drop-shadow-md">
                              {photo.caption}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/15 transition-all duration-300" />
                      )}

                      {/* Ícone de expandir — aparece só no hover */}
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md shadow-md border border-[#D4C5B9] flex items-center justify-center text-[#1A1A1A] hover:bg-[#6B8E6F] hover:text-white transition-all z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md shadow-md border border-[#D4C5B9] flex items-center justify-center text-[#1A1A1A] hover:bg-[#6B8E6F] hover:text-white transition-all z-10"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {activeModalPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setActiveModalPhoto(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#D4C5B9]/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] bg-black">
                <img
                  src={imgPresets.galleryFull(activeModalPhoto.url)}
                  alt={activeModalPhoto.caption}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = activeModalPhoto.url }}
                />
              </div>

              <div className="p-6 bg-[#1A1A1A] text-white border-t border-[#333333]">
                <h4 className="font-serif-heading font-semibold text-lg mb-1">{activeModalPhoto.caption}</h4>
                <p className="text-xs text-[#D4C5B9]">IDDA Veterinária • Estrada do Tutóia, 520 - Cosmos, RJ</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
