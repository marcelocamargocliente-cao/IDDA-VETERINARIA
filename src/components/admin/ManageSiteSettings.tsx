import React, { useState, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export const ManageSiteSettings: React.FC = () => {
  const { getSetting, updateSetting, uploadSettingImage } = useSiteSettings()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentHeroUrl = getSetting('hero_image', '')

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
    setPreviewUrl(URL.createObjectURL(file))
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

      // Usa o uploadSettingImage do hook — salva no bucket idda-photos
      const imageUrl = await uploadSettingImage(selectedFile, 'hero_image')
      setUploadProgress(70)

      if (!imageUrl) {
        throw new Error('Não foi possível obter a URL da imagem')
      }

      // Salva a URL em site_settings via hook
      const saved = await updateSetting('hero_image', imageUrl, 'Foto principal do Hero')
      setUploadProgress(100)

      if (saved) {
        setMessage({ type: 'success', text: '✅ Foto salva com sucesso! Recarregue a página para ver.' })
        setSelectedFile(null)
        setPreviewUrl('')
        setUploadProgress(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        throw new Error('Falha ao salvar configuração')
      }

    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage({ type: 'error', text: `❌ Erro: ${errorMsg}` })
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
          <ImageIcon className="w-5 h-5 text-[#6B8E6F]" />
          Foto do Hero
        </h3>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Altere a foto principal exibida na seção inicial da clínica
        </p>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Foto atual */}
      {currentHeroUrl && !previewUrl && (
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 mb-2 font-semibold uppercase tracking-wider">Foto Atual:</p>
          <img
            src={currentHeroUrl}
            alt="Foto atual do hero"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Preview da nova foto */}
      {previewUrl && (
        <div className="p-4 bg-[#6B8E6F]/10 rounded-xl border-2 border-[#6B8E6F]/30">
          <p className="text-xs text-[#6B8E6F] mb-2 font-semibold uppercase tracking-wider">Nova Foto (Preview):</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <p className="text-xs text-stone-500 mt-2">📁 {selectedFile?.name}</p>
        </div>
      )}

      {/* Área de upload */}
      <label className="block cursor-pointer">
        <div className="flex flex-col items-center justify-center w-full px-4 py-10 border-2 border-dashed border-stone-300 rounded-xl hover:border-[#6B8E6F] transition bg-stone-50">
          <Upload className="w-8 h-8 text-stone-400 mb-3" />
          <p className="text-sm font-semibold text-stone-700">
            Clique para selecionar ou arraste a imagem
          </p>
          <p className="text-xs text-stone-500 mt-1">JPG, PNG, WebP — máx. 5MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {/* Barra de progresso */}
      {isUploading && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Fazendo upload...</p>
            <p className="text-xs text-stone-500">{uploadProgress}%</p>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5">
            <div
              className="bg-[#6B8E6F] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Salvando...' : 'Salvar Foto'}
        </button>

        {selectedFile && !isUploading && (
          <button
            onClick={handleCancel}
            className="px-5 py-3 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 transition flex items-center gap-2 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400 text-center">
        A foto é sincronizada automaticamente em todos os dispositivos via Supabase.
      </p>
    </div>
  )
}
