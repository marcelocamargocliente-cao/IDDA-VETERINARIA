import React, { useState } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { ImageCropper } from './ImageCropper'
import { Upload, MapPin, LayoutTemplate, Image as ImageIcon, Check, Loader2, Sparkles, Database } from 'lucide-react'

interface SettingConfig {
  key: string
  title: string
  subtitle: string
  description: string
}

const SETTING_ITEMS: SettingConfig[] = [
  {
    key: 'hero_image',
    title: 'Foto Principal do Topo (Hero)',
    subtitle: 'Fachada e acolhimento no topo da página inicial',
    description: 'Imagem principal exibida ao lado do título de apresentação da clínica.'
  },
  {
    key: 'location_image',
    title: 'Foto da Seção de Localização',
    subtitle: 'Exibida em "Onde Estamos & Visitas" em Cosmos, RJ',
    description: 'Imagem da estrutura exibida na seção de localização.'
  },
  {
    key: 'gallery_featured',
    title: 'Foto em Destaque da Galeria',
    subtitle: 'Imagem de destaque do carrossel visual',
    description: 'Foto especial recomendada para apresentação da equipe ou instalações.'
  }
]

export const ManageSiteSettings: React.FC = () => {
  const { settings, getSetting, updateSetting, uploadSettingImage, loading, refetch } = useSiteSettings()

  const [activeKey, setActiveKey] = useState<string>('hero_image')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const currentConfig = SETTING_ITEMS.find((item) => item.key === activeKey) || SETTING_ITEMS[0]
  const currentImageUrl = previewUrl || getSetting(activeKey)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setSuccessMessage(null)

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecione um arquivo de imagem válido (JPG, PNG).')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setRawImageForCrop(result)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    const fileName = `site-${activeKey}-${Date.now()}.jpg`
    const file = new File([blob], fileName, { type: 'image/jpeg' })
    setSelectedFile(file)
    setPreviewUrl(dataUrl)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setRawImageForCrop(null)
  }

  const handleSaveToSupabase = async () => {
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      let finalUrl = previewUrl

      if (selectedFile) {
        const uploaded = await uploadSettingImage(selectedFile, activeKey)
        if (uploaded) {
          finalUrl = uploaded
        } else {
          throw new Error('Falha ao fazer upload da imagem para o Supabase Storage.')
        }
      }

      if (!finalUrl) {
        throw new Error('Nenhuma imagem selecionada para salvar.')
      }

      const success = await updateSetting(
        activeKey,
        finalUrl,
        currentConfig.description
      )

      if (success) {
        setSuccessMessage('✅ Foto salva com sucesso no Supabase (`site_settings`)!')
        setSelectedFile(null)
        await refetch()
      } else {
        throw new Error('Erro ao atualizar registro na tabela site_settings.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar salvamento.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-verde-600" />
            <span>Gerenciamento de Imagens do Site (`site_settings`)</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Faça upload e salve a foto principal do Hero diretamente no banco de dados Supabase e Storage.
          </p>
        </div>

        {/* Item Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {SETTING_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveKey(item.key)
                setPreviewUrl('')
                setSelectedFile(null)
                setSuccessMessage(null)
                setErrorMessage(null)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeKey === item.key
                  ? 'bg-verde-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {item.key === 'hero_image' ? 'Hero Principal' : item.key === 'location_image' ? 'Localização' : 'Galeria'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Editing Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Preview & Upload Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">{currentConfig.title}</h3>
            <p className="text-xs text-stone-500">{currentConfig.subtitle}</p>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shadow-inner">
              <img
                src={currentImageUrl || 'https://via.placeholder.com/1200x400?text=Sem+Imagem'}
                alt={currentConfig.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="pt-2">
              <label className="block w-full cursor-pointer bg-white border-2 border-dashed border-verde-500 hover:border-verde-600 rounded-xl p-4 text-center transition-all shadow-2xs hover:bg-verde-50/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1.5 text-stone-700">
                  <Upload className="w-5 h-5 text-verde-600" />
                  <span className="text-xs font-bold text-verde-700">Selecionar Nova Imagem (.jpg, .png)</span>
                  <span className="text-[11px] text-stone-400">Otimizado para armazenamento em nuvem</span>
                </div>
              </label>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleSaveToSupabase}
              disabled={isSaving || (!selectedFile && !previewUrl)}
              className="w-full bg-verde-600 hover:bg-verde-700 disabled:bg-stone-300 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvar Alteração no Banco de Dados</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Info & Status */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Como Funciona a Sincronização Supabase</span>
            </h4>
            <ul className="text-xs text-stone-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Armazenamento Seguro:</strong> As imagens são enviadas para o bucket Supabase Storage (`idda-photos` / `site_images`).
              </li>
              <li>
                <strong>Tabela `site_settings`:</strong> A URL pública é salva imediatamente no registro com chave <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">{activeKey}</code>.
              </li>
              <li>
                <strong>Atualização Instantânea:</strong> Ao salvar, a página inicial (Hero) e demais dispositivos buscam o dado atualizado diretamente da tabela.
              </li>
            </ul>

            <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs font-mono text-stone-700 break-all">
              <span className="text-stone-400 block mb-1 font-sans font-semibold">URL Atual no Banco:</span>
              {getSetting(activeKey) || 'Nenhuma URL gravada'}
            </div>
          </div>
        </div>

      </div>

      {/* Image Cropper Modal */}
      {showCropper && rawImageForCrop && currentConfig && (
        <ImageCropper
          imageSrc={rawImageForCrop}
          aspectRatio={16 / 9}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}
