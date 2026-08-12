import React, { useState } from 'react'
import { Testimonial } from '../../types'
import { Plus, Trash2, Edit2, Check, X, Star, Eye, EyeOff } from 'lucide-react'

interface TestimonialManagerProps {
  testimonials: Testimonial[]
  onAddTestimonial: (item: Omit<Testimonial, 'id' | 'created_at'>) => Promise<any>
  onUpdateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>
  onDeleteTestimonial: (id: string) => Promise<void>
}

export const TestimonialManager: React.FC<TestimonialManagerProps> = ({
  testimonials,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [authorName, setAuthorName] = useState('')
  const [petName, setPetName] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setAuthorName('')
    setPetName('')
    setContent('')
    setRating(5)
    setActive(true)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleStartEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setAuthorName(t.author_name)
    setPetName(t.pet_name)
    setContent(t.content)
    setRating(t.rating)
    setActive(t.active)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return

    setSubmitting(true)
    try {
      if (editingId) {
        await onUpdateTestimonial(editingId, {
          author_name: authorName,
          pet_name: petName,
          content,
          rating,
          active
        })
      } else {
        await onAddTestimonial({
          author_name: authorName,
          pet_name: petName,
          content,
          rating,
          active
        })
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
          <h3 className="font-display font-bold text-xl text-stone-900">Gerenciador de Depoimentos</h3>
          <p className="text-xs text-stone-500">Cadastre e modere as avaliações e experiências de tutores exibidas no site.</p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsFormOpen(true)
          }}
          className="bg-verde-600 hover:bg-verde-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Depoimento
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-verde-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-semibold text-stone-900 text-sm">
              {editingId ? 'Editar Depoimento' : 'Novo Depoimento de Tutor'}
            </h4>
            <button type="button" onClick={resetForm} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nome do Tutor</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nome e Raça do Pet</label>
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Ex: Thor (Golden Retriever)"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Relato / Depoimento</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva a avaliação sobre os cuidados da IDDA..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nota (Estrelas 1 a 5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-500"
              >
                <option value={5}>5 Estrelas (Excelente)</option>
                <option value={4}>4 Estrelas (Muito Bom)</option>
                <option value={3}>3 Estrelas (Bom)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="activeTestimonial"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-verde-600 rounded focus:ring-verde-500 border-stone-300"
              />
              <label htmlFor="activeTestimonial" className="text-xs font-semibold text-stone-700">
                Depoimento Ativo no Site
              </label>
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
              <span>{submitting ? 'Salvando...' : editingId ? 'Atualizar Depoimento' : 'Salvar Depoimento'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between space-y-4 ${
              !item.active ? 'opacity-60 border-dashed border-stone-300' : 'border-stone-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => onUpdateTestimonial(item.id, { active: !item.active })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {item.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{item.active ? 'Ativo' : 'Oculto'}</span>
                </button>
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed mb-3">"{item.content}"</p>

              <div className="text-xs font-semibold text-stone-900">
                {item.author_name} <span className="font-normal text-stone-500">({item.pet_name})</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[10px]">
                {new Date(item.created_at).toLocaleDateString('pt-BR')}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="text-verde-600 hover:text-verde-800 font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>

                <button
                  onClick={() => {
                    if (confirm('Deseja realmente excluir este depoimento?')) {
                      onDeleteTestimonial(item.id)
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
