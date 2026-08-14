import { useState, useRef } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB')
      return
    }

    setSelectedFile(file)
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Selecione uma foto primeiro')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(30)

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
        })

      if (dbError) throw dbError
      setUploadProgress(100)

      setTimeout(() => {
        alert('✅ Foto salva com sucesso!')
        if (onPhotoSaved) onPhotoSaved(imageUrl)
        
        setSelectedFile(null)
        setPreviewUrl('')
        setUploadProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 500)

    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error)
      alert(`Erro ao salvar foto: ${error instanceof Error ? error.message : 'Desconhecido'}`)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-stone-900">📸 Editar Foto do Hero</h3>
      <p className="text-sm text-stone-600 mb-4">
        Altere a foto principal exibida na página inicial da clínica
      </p>

      {currentPhotoUrl && !previewUrl && (
        <div className="mb-6 p-4 bg-stone-50 rounded-lg">
          <p className="text-xs text-stone-600 mb-2">Foto Atual:</p>
          <img 
            src={currentPhotoUrl} 
            alt="Foto atual"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      {previewUrl && (
        <div className="mb-6 p-4 bg-verde-50 rounded-lg border-2 border-verde-200">
          <p className="text-xs text-verde-700 mb-2">Nova Foto (Preview):</p>
          <img 
            src={previewUrl} 
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
          <p className="text-xs text-stone-600 mt-2">
            📁 Arquivo: {selectedFile?.name}
          </p>
        </div>
      )}

      <div className="mb-4">
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
        <div className="mb-4">
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
          className="flex-1 bg-verde-600 hover:bg-verde-700 disabled:bg-stone-300 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          {isUploading ? '⏳ Salvando...' : '💾 Salvar Foto'}
        </button>
        
        {selectedFile && (
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
          >
            ✕ Cancelar
          </button>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
        ℹ️ A foto será sincronizada em todos os dispositivos após o upload.
      </div>
    </div>
  )
}
