import React, { useState } from 'react'
import { Service } from '../../types'
import { Plus, Trash2, Edit2, Check, X, ShieldAlert, Stethoscope, Activity, Microscope, ShieldCheck, HeartPulse, Sparkles, EyeOff, Eye } from 'lucide-react'

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

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setIcon('Stethoscope')
    setImageUrl('')
    setHighlight('')
    setActive(true)
    setOrder(services.length + 1)
    setEditingId(null)
    setIsFormOpen(false)
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
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      if (editingId) {
        await onUpdateService(editingId, { title, description, icon, image_url: imageUrl, highlight, active, order })
      } else {
        await onAddService({ title, description, icon, image_url: imageUrl, highlight, active, order })
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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200">
        <div>
          <h3 className="font-display font-bold text-xl text-stone-900">Gerenciador de Serviços</h3>
          <p className="text-xs text-stone-500">Cadastre, edite ou desative especialidades e procedimentos veterinários oferecidos.</p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsFormOpen(true)
          }}
          className="bg-verde-600 hover:bg-verde-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {/* Form Modal / Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-verde-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-semibold text-stone-900 text-sm">
              {editingId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
            </h4>
            <button type="button" onClick={resetForm} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Título do Serviço</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consultas Oftalmológicas"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Ícone Representativo</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              >
                <option value="Stethoscope">Stethoscope (Estetoscópio/Consulta)</option>
                <option value="ShieldAlert">ShieldAlert (Urgência/Emergência)</option>
                <option value="Activity">Activity (Cirurgia/Cardiologia)</option>
                <option value="Microscope">Microscope (Exames/Laboratório)</option>
                <option value="ShieldCheck">ShieldCheck (Vacinas/Proteção)</option>
                <option value="HeartPulse">HeartPulse (Internação/UTI)</option>
                <option value="Syringe">Syringe (Vacinação/Injeções)</option>
                <option value="Sparkles">Sparkles (Especialidades)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Descrição do Serviço</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhes do procedimento..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">URL da Foto do Serviço</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Destaque / Badge (Opcional)</label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Ex: 24 Horas, Especialistas, Bloco Cirúrgico"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-verde-600 rounded focus:ring-verde-500 border-stone-300"
              />
              <label htmlFor="active" className="text-xs font-semibold text-stone-700">
                Serviço Ativo e Visível no Site
              </label>
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
              <span>{submitting ? 'Salvando...' : editingId ? 'Atualizar Serviço' : 'Salvar Serviço'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between space-y-4 ${
              !service.active ? 'opacity-60 border-dashed border-stone-300' : 'border-stone-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  Ícone: {service.icon}
                </span>
                
                <button
                  onClick={() => onUpdateService(service.id, { active: !service.active })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    service.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {service.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{service.active ? 'Ativo' : 'Inativo'}</span>
                </button>
              </div>

              <h4 className="font-display font-bold text-stone-900 text-lg">{service.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">{service.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 font-mono text-[11px]">Ordem #{service.order}</span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartEdit(service)}
                  className="text-verde-600 hover:text-verde-800 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>

                <button
                  onClick={() => {
                    if (confirm('Deseja realmente excluir este serviço?')) {
                      onDeleteService(service.id)
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
