import React, { useState, useRef } from 'react'
import { Photo } from '../../types'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { Plus, Trash2, Edit2, Check, X, Tag, Upload, RefreshCw, AlertCircle } from 'lucide-react'

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
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg)
    setTimeout(() => setFeedbackMessage(null), 4000)
  }

  const resetForm = () => {
    setUrl('')
    setCaption('')
    setCategory('gallery')
    setOrder(photos.length + 1)
    setEditingId(null)
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadError(null)
    setIsFormOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStartEdit = (p: Photo) => {
    setEditingId(p.id)
    setUrl(p.url)
    setCaption(p.caption)
    setCategory(p.category)
    setOrder(p.order)
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadError(null)
    setIsFormOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP, etc).')
      return
    }

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('A imagem selecionada é muito grande. Escolha uma foto de até 8MB.')
      return
    }

    setSelectedFile(file)

    // Generate local preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadImageFile = async (file: File): Promise<string> => {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg'
        const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, '')
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`
        const filePath = `photos/${fileName}`

        const { error: storageError } = await supabase.storage
          .from('idda-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (!storageError) {
          const { data } = supabase.storage
            .from('idda-photos')
            .getPublicUrl(filePath)

          if (data?.publicUrl) {
            return data.publicUrl
          }
        } else {
          console.warn('Supabase storage upload error, using Data URL fallback:', storageError)
        }
      } catch (err) {
        console.warn('Supabase upload exception, using fallback:', err)
      }
    }

    // Fallback: convert to base64 Data URL so it persists seamlessly in local storage and preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Falha ao processar arquivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)

    // If no file selected and no existing URL
    if (!selectedFile && !url.trim()) {
      setUploadError('Por favor, selecione uma foto do seu computador.')
      return
    }

    setSubmitting(true)
    try {
      let finalImageUrl = url.trim()

      // If user chose a new file, upload/process it
      if (selectedFile) {
        finalImageUrl = await uploadImageFile(selectedFile)
      }

      if (editingId) {
        await onUpdatePhoto(editingId, {
          url: finalImageUrl,
          caption,
          category,
          order
        })
        showFeedback('✅ Foto atualizada com sucesso!')
      } else {
        await onAddPhoto({
          url: finalImageUrl,
          caption,
          category,
          order
        })
        showFeedback('✅ Nova foto adicionada com sucesso!')
      }
      resetForm()
    } catch (err: any) {
      console.error(err)
      setUploadError('Erro ao salvar foto: ' + (err.message || 'Tente novamente.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500 font-semibold text-xs animate-in slide-in-from-top-4 flex items-center gap-2">
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <h3 className="font-display font-bold text-xl text-stone-900">Gerenciador de Fotos</h3>
          <p className="text-xs text-stone-500">Adicione, troque fotos do seu computador e gerencie as imagens da clínica.</p>
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
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-verde-500/40 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 className="w-4 h-4 text-verde-600" />
                    Editar e Trocar Foto
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-verde-600" />
                    Adicionar Nova Foto
                  </>
                )}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {editingId ? 'Envie um novo arquivo de imagem para substituir a foto atual ou edite os detalhes.' : 'Envie uma foto do seu computador ou informe um link direto.'}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* PHOTO REPLACEMENT & UPLOAD ZONE */}
          <div className="bg-stone-50/90 p-5 sm:p-6 rounded-2xl border border-stone-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-verde-600" />
                {editingId ? 'Escolher Nova Foto no PC' : 'Escolher Foto no PC'}
              </label>
              
              <div className="flex flex-col gap-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-verde-300 hover:border-verde-500 bg-white hover:bg-verde-50/40 rounded-2xl p-4 cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-verde-600 mb-1.5" />
                  <span className="text-xs font-bold text-stone-800">
                    {selectedFile ? 'Trocar arquivo selecionado' : 'Clique para selecionar foto do seu computador'}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5">
                    Formatos suportados: JPG, PNG, WebP, GIF (máximo 8MB)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* PREVIEWS: CURRENT VS NEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Current Image (if editing) */}
              {editingId && url && (
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-2">Foto Atual:</span>
                  <div className="aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden relative">
                    <img src={url} alt="Foto atual" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Newly Selected Preview */}
              {previewImage && (
                <div className="bg-white p-3 rounded-xl border-2 border-verde-500 shadow-sm relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-verde-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-verde-600" /> Foto Selecionada:
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveSelectedFile}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden">
                    <img src={previewImage} alt="Nova foto selecionada" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1.5 truncate">
                    {selectedFile?.name} ({(Number(selectedFile?.size || 0) / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* METADATA FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Legenda / Descrição</label>
              <input
                type="text"
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ex: Consultório moderno climatizado para cães e gatos"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
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
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-verde-600 hover:bg-verde-700 text-white flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando & Salvando...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingId ? 'Atualizar Foto' : 'Salvar Nova Foto'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                <Tag className="w-3 h-3" /> {photo.category}
              </span>
              <span className="absolute top-2 right-2 bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow-xs">
                #{photo.order}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs font-medium text-stone-800 line-clamp-2 min-h-[32px]">{photo.caption}</p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleStartEdit(photo)}
                  className="text-verde-600 hover:text-verde-800 font-semibold flex items-center gap-1.5 p-1 rounded hover:bg-verde-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar / Trocar
                </button>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta foto?')) {
                      onDeletePhoto(photo.id)
                      showFeedback('Foto excluída com sucesso.')
                    }
                  }}
                  className="text-urgencia hover:text-red-700 font-semibold flex items-center gap-1 p-1 rounded hover:bg-red-50 transition-colors"
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

