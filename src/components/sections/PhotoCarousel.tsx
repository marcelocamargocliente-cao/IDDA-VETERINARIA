import React, { useState, useEffect } from 'react'
import { Image as ImageIcon, Maximize2, X } from 'lucide-react'
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
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_PHOTOS)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gallery' | 'service'>('all')
  const [activeModalPhoto, setActiveModalPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase.from('photos').select('*').order('order')
        if (data && data.length > 0) setPhotos(data)
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

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filteredPhotos = photos.filter(p =>
    selectedCategory === 'all' || p.category === selectedCategory
  )

  const countAll      = photos.length
  const countGallery  = photos.filter(p => p.category === 'gallery').length
  const countService  = photos.filter(p => p.category === 'service').length

  const filters = [
    { id: 'all',     label: 'Todas',         count: countAll },
    { id: 'gallery', label: 'Estrutura',      count: countGallery },
    { id: 'service', label: 'Procedimentos',  count: countService },
  ]

  return (
    <section id="galeria" className="py-20 sm:py-24 bg-[#F5F1ED] border-t border-[#D4C5B9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B7355] bg-[#FFFFFF] px-4 py-1.5 rounded-full inline-block border border-[#D4C5B9] shadow-2xs">
              Conheça Nossa Estrutura
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
              A IDDA em ação — <br className="hidden sm:inline" />
              <span className="italic text-[#6B8E6F] font-normal">Momentos de cuidado e amor</span>
            </h2>
            <p className="text-[#4A4A4A] text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Ambientes climatizados, equipamentos modernos e uma recepção acolhedora preparada para oferecer máximo conforto.
            </p>
          </div>

          {/* Filtros com contador */}
          <div className="flex flex-wrap gap-2">
            {filters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#6B8E6F] text-white shadow-sm'
                    : 'bg-[#FFFFFF] text-[#6B6B6B] hover:bg-[#D4C5B9]/40 border border-[#D4C5B9]'
                }`}
              >
                {cat.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-[#D4C5B9]/40 text-[#8B7355]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid de fotos */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((n) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setActiveModalPhoto(photo)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-[#1A1A1A] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#D4C5B9]/60 hover:border-[#6B8E6F]/50
                  ${idx === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}
                `}
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

                {/* Legenda — só aparece no hover se preenchida */}
                {photo.caption ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-xs font-semibold leading-snug drop-shadow-md">{photo.caption}</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/15 transition-all duration-300" />
                )}

                {/* Ícone expandir */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal lightbox */}
        {activeModalPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
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

              {activeModalPhoto.caption && (
                <div className="p-5 bg-[#1A1A1A] text-white border-t border-[#333333]">
                  <p className="text-sm font-semibold">{activeModalPhoto.caption}</p>
                  <p className="text-xs text-[#D4C5B9] mt-1">IDDA Veterinária</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
