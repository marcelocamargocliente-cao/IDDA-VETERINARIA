import React, { useState, useRef } from 'react'
import { Service } from '../../types'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Image as ImageIcon,
  Sparkles,
  Database,
  Copy,
  CheckCheck
} from 'lucide-react'

interface ServiceManagerProps {
  services: Service[]
  onAddService: (service: Omit<Service, 'id'>) => Promise<any>
  onUpdateService: (id: string, updates: Partial<Service>) => Promise<void>
  onDeleteService: (id: string) => Promise<void>
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Stethoscope')
  const [imageUrl, setImageUrl] = useState('')
  const [highlight, setHighlight] = useState('')
  const [active, setActive] = useState(true)
  const [order, setOrder] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // File upload state for changing service photo
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [showSqlGuide, setShowSqlGuide] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg)
    setTimeout(() => setFeedbackMessage(null), 4000)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setIcon('Stethoscope')
    setImageUrl('')
    setHighlight('')
    setActive(true)
    setOrder(services.length + 1)
    setEditingId(null)
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadError(null)
    setIsFormOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStartEdit = (s: Service) => {
    setEditingId(s.id)
    setTitle(s.title)
    setDescription(s.description)
    setIcon(s.icon || 'Stethoscope')
    setImageUrl(s.image_url || s.image || '')
    setHighlight(s.highlight || '')
    setActive(s.active)
    setOrder(s.order)
    setSelectedFile(null)
    setPreviewImage(null)
    setUploadError(null)
    setIsFormOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP, GIF).')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('A imagem selecionada é muito grande. Escolha uma foto de até 8MB.')
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImageFile = async (file: File, serviceId?: string): Promise<string> => {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg'
        const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, '')
        const fileName = `services/service-${serviceId || 'new'}-${Date.now()}.${cleanExt}`

        const { error: storageError } = await supabase.storage
          .from('idda-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (!storageError) {
          const { data } = supabase.storage
            .from('idda-photos')
            .getPublicUrl(fileName)

          if (data?.publicUrl) {
            return data.publicUrl
          }
        } else {
          console.warn('Supabase storage upload error, using fallback:', storageError)
        }
      } catch (err) {
        console.warn('Supabase upload exception, using fallback:', err)
      }
    }

    // Fallback Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Falha ao processar arquivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setUploadError('O título do serviço é obrigatório.')
      return
    }

    setSubmitting(true)
    setUploadError(null)

    try {
      let finalImageUrl = imageUrl.trim()

      if (selectedFile) {
        finalImageUrl = await uploadImageFile(selectedFile, editingId || undefined)
      }

      if (editingId) {
        await onUpdateService(editingId, {
          title,
          description,
          icon,
          image_url: finalImageUrl,
          highlight,
          active,
          order
        })
        showFeedback('✅ Serviço e foto atualizados com sucesso!')
      } else {
        await onAddService({
          title,
          description,
          icon,
          image_url: finalImageUrl,
          highlight,
          active,
          order
        })
        showFeedback('✅ Novo serviço cadastrado com sucesso!')
      }
      resetForm()
    } catch (err: any) {
      console.error(err)
      setUploadError('Erro ao salvar serviço: ' + (err.message || 'Tente novamente.'))
    } finally {
      setSubmitting(false)
    }
  }

  const sqlSchemaScript = `-- SQL para criar a tabela 'services' no Supabase:
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  icon VARCHAR(100) DEFAULT 'Stethoscope',
  highlight VARCHAR(100),
  order_display INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable" ON services
  FOR SELECT USING (true);

CREATE POLICY "Services are editable by all" ON services
  FOR ALL USING (true);`

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500 font-semibold text-xs animate-in slide-in-from-top-4 flex items-center gap-2">
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-xl text-stone-900">Gerenciar Serviços & Fotos</h3>
            <span className="text-[11px] bg-verde-50 text-verde-700 px-2.5 py-0.5 rounded-full font-bold border border-verde-200">
              Supabase Integrado
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Veja os serviços cadastrados, troque a foto de cada um enviando do computador e edite títulos e descrições.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowSqlGuide(!showSqlGuide)}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-stone-500" />
            <span>SQL Supabase</span>
          </button>

          <button
            onClick={() => {
              resetForm()
              setIsFormOpen(true)
            }}
            className="flex-1 sm:flex-initial bg-verde-600 hover:bg-verde-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Serviço
          </button>
        </div>
      </div>

      {/* SQL Helper Box */}
      {showSqlGuide && (
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 rounded-2xl border border-stone-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-verde-400">
              <Database className="w-4 h-4" />
              <span>Código SQL para o Supabase SQL Editor</span>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 text-[11px] bg-stone-800 hover:bg-stone-700 text-white px-2.5 py-1 rounded-lg transition-colors border border-stone-700"
            >
              {copiedSql ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] font-mono bg-black/40 p-3 rounded-lg overflow-x-auto text-stone-300">
            {sqlSchemaScript}
          </pre>
        </div>
      )}

      {/* Edit / Create Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <h4 className="font-display font-bold text-stone-900 text-xl flex items-center gap-2">
                  {editingId ? (
                    <>
                      <Edit2 className="w-5 h-5 text-verde-600" />
                      Editar Serviço & Trocar Foto
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-verde-600" />
                      Cadastrar Novo Serviço
                    </>
                  )}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Selecione uma imagem do seu computador ou altere as informações do serviço.
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
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Photo Upload & Preview Box */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-verde-600" />
                  Foto do Serviço (Upload do Computador)
                </label>

                {/* Previews (Current or New) */}
                <div className="relative aspect-[16/10] bg-stone-200 rounded-xl overflow-hidden border border-stone-300">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview selecionada" className="w-full h-full object-cover" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Foto atual" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span>Nenhuma foto configurada</span>
                    </div>
                  )}

                  {(previewImage || imageUrl) && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {previewImage ? 'Nova foto pronta para upload' : 'Foto atual'}
                    </div>
                  )}
                </div>

                {/* File input */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-verde-300 hover:border-verde-500 bg-white hover:bg-verde-50/40 rounded-xl p-4 cursor-pointer transition-all">
                  <Upload className="w-5 h-5 text-verde-600 mb-1" />
                  <span className="text-xs font-bold text-stone-800">
                    {selectedFile ? selectedFile.name : 'Clique para selecionar foto do seu PC'}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5">
                    JPG, PNG, WebP ou GIF (máximo 8MB)
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Optional Direct URL input */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Ou informe a URL direta da imagem (opcional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      if (!selectedFile) setPreviewImage(null)
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
                  />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Título do Serviço *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Atendimento de Urgência & Emergência"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Destaque / Badge (Opcional)</label>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    placeholder="Ex: 24 Horas, Especialistas, Bloco Cirúrgico"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Descrição Detalhada *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o serviço para os tutores..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800 leading-relaxed"
                />
              </div>

              {/* Icon, Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ícone</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
                  >
                    <option value="ShieldAlert">ShieldAlert (Urgência)</option>
                    <option value="Stethoscope">Stethoscope (Consultas)</option>
                    <option value="Activity">Activity (Cirurgias)</option>
                    <option value="ShieldCheck">ShieldCheck (Vacinas)</option>
                    <option value="Microscope">Microscope (Exames)</option>
                    <option value="HeartPulse">HeartPulse (Ultrassom/UTI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500 text-stone-800"
                  />
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="service_active"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 text-verde-600 rounded focus:ring-verde-500 border-stone-300 cursor-pointer"
                  />
                  <label htmlFor="service_active" className="text-xs font-bold text-stone-700 cursor-pointer">
                    Visível no Site
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
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
                      <span>Salvando no Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Services Grid (Visual Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between group transition-all duration-300 ${
              !service.active ? 'opacity-65 border-dashed border-stone-300' : 'border-stone-200 hover:shadow-md'
            }`}
          >
            {/* Service Photo Preview */}
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
              {service.image_url || service.image ? (
                <img
                  src={service.image_url || service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                  Sem foto
                </div>
              )}

              {service.highlight && (
                <span className="absolute top-2.5 left-2.5 bg-verde-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {service.highlight}
                </span>
              )}

              <span className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                #{service.order}
              </span>
            </div>

            {/* Service Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-display font-bold text-stone-900 text-base leading-tight">
                    {service.title}
                  </h4>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onUpdateService(service.id, { active: !service.active })}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    service.active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {service.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{service.active ? 'Ativo' : 'Oculto'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(service)}
                    className="bg-verde-50 hover:bg-verde-100 text-verde-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Trocar Foto / Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir o serviço "${service.title}"?`)) {
                        onDeleteService(service.id)
                        showFeedback('Serviço excluído com sucesso.')
                      }
                    }}
                    className="text-stone-400 hover:text-urgencia p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Excluir serviço"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
