import React, { useState } from 'react'
import { Photo } from '../../types'
import { Plus, Trash2, Edit2, Image as ImageIcon, Check, X, Tag } from 'lucide-react'

interface PhotoManagerProps {
  photos: Photo[]
  onAddPhoto: (photo: Omit<Photo, 'id' | 'created_at'>) => Promise<any>
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => Promise<void>
  onDeletePhoto: (id: string) => Promise<void>
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({
  photos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState<'gallery' | 'hero' | 'service'>('gallery')
  const [order, setOrder] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setUrl('')
    setCaption('')
    setCategory('gallery')
    setOrder(photos.length + 1)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleStartEdit = (p: Photo) => {
    setEditingId(p.id)
    setUrl(p.url)
    setCaption(p.caption)
    setCategory(p.category)
    setOrder(p.order)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setSubmitting(true)
    try {
      if (editingId) {
        await onUpdatePhoto(editingId, { url, caption, category, order })
      } else {
        await onAddPhoto({ url, caption, category, order })
      }
      resetForm()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <h3 className="font-display font-bold text-xl text-stone-900">Gerenciador de Fotos</h3>
          <p className="text-xs text-stone-500">Adicione e gerencie as imagens exibidas no carrossel e na galeria da clínica.</p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsFormOpen(true)
          }}
          className="bg-verde-600 hover:bg-verde-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Nova Foto
        </button>
      </div>

      {/* Form Modal / Collapsible */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-verde-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-semibold text-stone-900 text-sm">
              {editingId ? 'Editar Foto' : 'Adicionar Nova Foto'}
            </h4>
            <button type="button" onClick={resetForm} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">URL da Imagem</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Legenda / Descrição</label>
              <input
                type="text"
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ex: Consultório moderno climatizado"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              >
                <option value="gallery">Galeria / Estrutura</option>
                <option value="hero">Destaque Principal (Hero)</option>
                <option value="service">Serviços e Equipamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Ordem de Exibição</label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-verde-600 hover:bg-verde-700 text-white flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Salvando...' : editingId ? 'Atualizar Foto' : 'Salvar Foto'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Photos Table / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative aspect-[16/10] bg-stone-100">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                <Tag className="w-3 h-3" /> {photo.category}
              </span>
              <span className="absolute top-2 right-2 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                #{photo.order}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs font-medium text-stone-800 line-clamp-2">{photo.caption}</p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleStartEdit(photo)}
                  className="text-verde-600 hover:text-verde-800 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta foto?')) {
                      onDeletePhoto(photo.id)
                    }
                  }}
                  className="text-urgencia hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
