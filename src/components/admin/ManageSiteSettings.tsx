import React, { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ManageSiteSettingsProps {
  onPhotoSaved?: (url: string) => void
  currentPhotoUrl?: string
}

export const ManageSiteSettings: React.FC<ManageSiteSettingsProps> = ({ 
  onPhotoSaved,
  currentPhotoUrl 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Imagem muito grande. Máximo 5MB' })
      return
    }

    setSelectedFile(file)
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setMessage(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Selecione uma foto primeiro' })
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(30)
      setMessage(null)

      const fileName = `hero-${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(fileName, selectedFile, { upsert: true })

      if (uploadError) throw uploadError
      setUploadProgress(60)

      const { data: urlData } = supabase.storage
        .from('site_images')
        .getPublicUrl(fileName)

      const imageUrl = urlData.publicUrl
      setUploadProgress(80)

      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'hero_image',
          value: imageUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' })

      if (dbError) throw dbError
      setUploadProgress(100)

      setTimeout(() => {
        setMessage({ type: 'success', text: '✅ Foto salva com sucesso!' })
        if (onPhotoSaved) onPhotoSaved(imageUrl)
        
        setSelectedFile(null)
        setPreviewUrl('')
        setUploadProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 500)

    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage({ type: 'error', text: `❌ Erro ao salvar foto: ${errorMsg}` })
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setUploadProgress(0)
    setMessage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6 max-w-3xl">
      <div>
        <h3 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-verde-600" />
          Editar Foto do Hero
        </h3>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Altere a foto principal exibida na página inicial da clínica
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {currentPhotoUrl && !previewUrl && (
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-xs text-stone-600 mb-2 font-semibold">Foto Atual:</p>
          <img 
            src={currentPhotoUrl} 
            alt="Foto atual do hero"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      {previewUrl && (
        <div className="p-4 bg-verde-50 rounded-lg border-2 border-verde-200">
          <p className="text-xs text-verde-700 mb-2 font-semibold">Nova Foto (Preview):</p>
          <img 
            src={previewUrl} 
            alt="Preview da nova foto"
            className="w-full h-48 object-cover rounded"
          />
          <p className="text-xs text-stone-600 mt-2">
            📁 Arquivo: {selectedFile?.name}
          </p>
        </div>
      )}

      <div>
        <label className="block">
          <div className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-verde-500 transition bg-stone-50">
            <div className="text-center">
              <p className="text-2xl mb-2">📤</p>
              <p className="text-sm font-semibold text-stone-900">
                Arraste a imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Máximo: 5MB | Tipos: JPG, PNG, WebP
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-stone-700">Upload em andamento...</p>
            <p className="text-sm text-stone-600">{uploadProgress}%</p>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-verde-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-verde-600 hover:bg-verde-700 disabled:bg-stone-300 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition"
        >
          {isUploading ? '⏳ Salvando...' : '💾 Salvar Foto'}
        </button>
        
        {selectedFile && (
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        )}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
        ℹ️ A foto será sincronizada em todos os dispositivos após o upload.
      </div>
    </div>
  )
}
