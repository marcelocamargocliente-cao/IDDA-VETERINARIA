import React, { useState, useRef } from 'react'
import { ImageCropper } from './ImageCropper'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { isSupabaseConfigured } from '../../lib/supabase'
import {
  Image as ImageIcon,
  Upload,
  Scissors,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  Copy,
  CheckCheck,
  Sparkles,
  Database,
  MapPin,
  Compass,
  LayoutTemplate
} from 'lucide-react'

interface ImageConfig {
  key: string
  title: string
  subtitle: string
  description: string
  aspectRatio: number
  icon: React.ElementType
}

const SECTION_CONFIGS: ImageConfig[] = [
  {
    key: 'location_image',
    title: 'Foto da Seção de Localização',
    subtitle: 'Exibida em "Onde Estamos & Visitas" em Cosmos, RJ',
    description: 'Imagem da estrutura/pet exibida no lado direito da seção de localização e como chegar.',
    aspectRatio: 16 / 9,
    icon: MapPin
  },
  {
    key: 'hero_image',
    title: 'Foto Principal do Topo (Hero)',
    subtitle: 'Fachada e acolhimento no topo da página inicial',
    description: 'Imagem de alto impacto visual exibida ao lado do título principal de apresentação da clínica.',
    aspectRatio: 16 / 9,
    icon: LayoutTemplate
  },
  {
    key: 'gallery_featured',
    title: 'Foto em Destaque da Galeria',
    subtitle: 'Imagem de destaque do carrossel visual',
    description: 'Foto especial recomendada para apresentação da equipe ou instalações modernas.',
    aspectRatio: 16 / 9,
    icon: ImageIcon
  }
]

export const ManageSectionImages: React.FC = () => {
  const { settings, getSetting, updateSetting, uploadSettingImage, loading } = useSiteSettings()

  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [directUrl, setDirectUrl] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [showSqlGuide, setShowSqlGuide] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeConfig = SECTION_CONFIGS.find((c) => c.key === editingKey)

  const handleOpenEdit = (config: ImageConfig) => {
    setEditingKey(config.key)
    const currentVal = getSetting(config.key)
    setDirectUrl(currentVal)
    setPreviewImage(currentVal || null)
    setSelectedFile(null)
    setRawImageForCrop(null)
    setShowCropper(false)
    setUploadError(null)
  }

  const handleCloseModal = () => {
    setEditingKey(null)
    setSelectedFile(null)
    setPreviewImage(null)
    setRawImageForCrop(null)
    setShowCropper(false)
    setUploadError(null)
    setDirectUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP ou GIF).')
      return
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError('A imagem selecionada é muito grande. Escolha uma foto de até 12MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setRawImageForCrop(dataUrl)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedBlob: Blob, croppedDataUrl: string) => {
    const fileName = `section-${editingKey || 'img'}-${Date.now()}.jpg`
    const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
    setSelectedFile(file)
    setPreviewImage(croppedDataUrl)
    setDirectUrl('')
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    if (!selectedFile && !directUrl) {
      setRawImageForCrop(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!editingKey) return

    setIsSaving(true)
    setUploadError(null)

    try {
      let finalUrl = directUrl.trim()

      if (selectedFile) {
        const uploadedUrl = await uploadSettingImage(selectedFile, editingKey)
        if (uploadedUrl) {
          finalUrl = uploadedUrl
        } else {
          throw new Error('Falha ao processar o upload da imagem.')
        }
      }

      if (!finalUrl && !previewImage) {
        throw new Error('Por favor selecione uma foto ou insira uma URL válida.')
      }

      const success = await updateSetting(
        editingKey,
        finalUrl || previewImage || '',
        activeConfig?.description
      )

      if (success) {
        setFeedbackMessage(`Imagem "${activeConfig?.title}" atualizada com sucesso!`)
        setTimeout(() => setFeedbackMessage(null), 4000)
        handleCloseModal()
      } else {
        throw new Error('Não foi possível salvar as configurações.')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Ocorreu um erro ao salvar.')
    } finally {
      setIsSaving(false)
    }
  }

  const sqlSetupSnippet = `-- Criar tabela site_settings (se não existir)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description VARCHAR(500),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir registros padrões de imagem
INSERT INTO site_settings (key, value, description) VALUES
('location_image', 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80', 'Foto da seção de Localização em Cosmos'),
('hero_image', 'https://nbdwgblwkvirdmbbfmaw.supabase.co/storage/v1/object/public/idda-photos/fachada.jpg', 'Foto do Topo (Hero)'),
('gallery_featured', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80', 'Foto em destaque da galeria')
ON CONFLICT (key) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
CREATE POLICY "Leitura pública de configurações" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Escrita para todos (ou autenticado)" ON site_settings
  FOR ALL USING (true);
`

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupSnippet)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 3000)
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
            Mídias Estruturais
          </span>
          <h3 className="font-display font-bold text-2xl text-stone-900">
            Gerenciar Imagens das Seções
          </h3>
          <p className="text-stone-500 text-sm mt-1 max-w-2xl">
            Altere as fotos fixas das seções principais do site (Localização, Hero, etc.) com corte, zoom e envio para o banco de dados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-stone-200 cursor-pointer"
          >
            <Database className="w-4 h-4 text-verde-600" />
            <span>{showSqlGuide ? 'Ocultar SQL Supabase' : 'Tabela Supabase (SQL)'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 bg-verde-50 border border-verde-200 text-verde-800 rounded-2xl text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-5 h-5 text-verde-600 shrink-0" />
          <span className="font-medium">{feedbackMessage}</span>
        </div>
      )}

      {/* SQL Setup Helper Panel */}
      {showSqlGuide && (
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-verde-400" />
              <h4 className="font-bold text-base text-white">
                Script SQL para a tabela <code className="text-verde-400 bg-stone-800 px-1.5 py-0.5 rounded">site_settings</code>
              </h4>
            </div>
            <button
              type="button"
              onClick={handleCopySql}
              className="flex items-center gap-1.5 bg-verde-600 hover:bg-verde-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              {copiedSql ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Execute este comando no <strong>Supabase &gt; SQL Editor</strong> para criar a tabela de configurações e habilitar persistência permanente em nuvem.
          </p>

          <pre className="p-4 bg-stone-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-stone-800 leading-relaxed">
            {sqlSetupSnippet}
          </pre>
        </div>
      )}

      {/* Image Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTION_CONFIGS.map((config) => {
          const currentUrl = getSetting(config.key)
          const Icon = config.icon

          return (
            <div
              key={config.key}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Preview Container */}
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden border-b border-stone-100 group">
                  {currentUrl ? (
                    <img
                      src={currentUrl}
                      alt={config.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                      <ImageIcon className="w-8 h-8 mb-1 text-stone-300" />
                      <span>Sem imagem configurada</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-verde-400" />
                    <span>{config.title}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-2">
                  <h4 className="font-display font-bold text-stone-900 text-base">
                    {config.title}
                  </h4>
                  <p className="text-xs font-medium text-[#8B7355]">
                    {config.subtitle}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed pt-1">
                    {config.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(config)}
                  className="w-full bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Trocar & Recortar Foto</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* EDIT MODAL */}
      {editingKey && activeConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between z-10">
              <div>
                <h4 className="font-display font-bold text-stone-900 text-lg sm:text-xl flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-verde-600" />
                  <span>{activeConfig.title}</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Selecione uma nova foto do computador, enquadre no recorte e salve.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-6 space-y-6">

              {uploadError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Cropper Modal when an image is selected */}
              {showCropper && rawImageForCrop && (
                <ImageCropper
                  imageSrc={rawImageForCrop}
                  aspectRatio={activeConfig.aspectRatio}
                  onCropComplete={handleCropComplete}
                  onCancel={handleCropCancel}
                />
              )}

              {/* Photo Box */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-verde-600" />
                    Foto da Seção (Upload com Recorte)
                  </label>

                  {rawImageForCrop && (
                    <button
                      type="button"
                      onClick={() => setShowCropper(true)}
                      className="text-[11px] font-bold text-verde-700 hover:text-verde-800 bg-verde-100/80 hover:bg-verde-200/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Recortar Novamente
                    </button>
                  )}
                </div>

                {/* Visual Preview */}
                <div className="relative aspect-[16/9] bg-stone-200 rounded-2xl overflow-hidden border border-stone-300">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Pré-visualização"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span>Nenhuma imagem selecionada</span>
                    </div>
                  )}

                  {previewImage && (
                    <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      {selectedFile ? 'Nova foto recortada pronta' : 'Foto atual do site'}
                    </div>
                  )}
                </div>

                {/* File input */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-verde-400 hover:border-verde-600 bg-white hover:bg-verde-50/50 rounded-2xl p-4 cursor-pointer transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="w-5 h-5 text-verde-600" />
                    <Scissors className="w-4 h-4 text-verde-600" />
                  </div>
                  <span className="text-xs font-bold text-stone-800">
                    {selectedFile ? selectedFile.name : 'Clique para selecionar foto do seu PC (com corte e zoom)'}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    JPG, PNG, WebP ou GIF — Uma ferramenta de corte abrirá automaticamente!
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Ou insira uma URL direta de imagem (opcional)
                  </label>
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => {
                      setDirectUrl(e.target.value)
                      if (e.target.value.trim()) {
                        setPreviewImage(e.target.value.trim())
                        setSelectedFile(null)
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
                  />
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="bg-[#F5F1ED] p-4 rounded-xl text-xs text-[#4A4A4A] space-y-1">
                <p>
                  <strong>Proporção ideal:</strong> 16:9 (paisagem/horizontal).
                </p>
                <p className="text-[11px] text-stone-500">
                  A imagem será salva no Supabase (se configurado) e sincronizada instantaneamente na página principal da clínica.
                </p>
              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 sm:px-8 sm:py-5 flex items-center gap-4 z-10 shadow-lg">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 text-stone-500" />
                <span>Cancelar</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || (!selectedFile && !directUrl.trim() && !previewImage)}
                className="flex-1 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Salvando Imagem...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Salvar Imagem</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export const SectionImageManager = ManageSectionImages
export default ManageSectionImages
