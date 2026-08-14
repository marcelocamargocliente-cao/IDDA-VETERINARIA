import React, { useState } from 'react'
import { PhotoManager } from './PhotoManager'
import { ServiceManager } from './ServiceManager'
import { TestimonialManager } from './TestimonialManager'
import { ManageSectionImages } from './ManageSectionImages'
import { usePhotos } from '../../hooks/usePhotos'
import { useServices } from '../../hooks/useServices'
import { useTestimonials } from '../../hooks/useTestimonials'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { isSupabaseConfigured } from '../../lib/supabase'
import { CLINIC_CONFIG } from '../../config/constants'
import { 
  Image as ImageIcon, 
  Stethoscope, 
  MessageSquareQuote, 
  LogOut, 
  Database, 
  ShieldCheck, 
  ArrowLeft,
  Settings,
  Sparkles,
  LayoutTemplate,
  Phone,
  MapPin,
  Clock
} from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
  onClose: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'services' | 'testimonials' | 'sections' | 'settings'>('photos')

  const { photos, addPhoto, updatePhoto, deletePhoto } = usePhotos()
  const { services, addService, updateService, deleteService } = useServices()
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const { settings } = useSiteSettings()

  return (
    <div className="fixed inset-0 z-50 bg-stone-100 overflow-y-auto">
      
      {/* Top Navigation */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-xl text-white">
              IDDA <span className="text-verde-500">Admin</span>
            </span>
            <span className="text-xs bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded-full border border-stone-700 hidden sm:inline-block">
              Painel de Controle
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Site</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-semibold bg-urgencia hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner with Stats and Supabase Status */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4">
            <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-stone-900">{photos.length}</span>
              <p className="text-xs font-medium text-stone-500">Fotos Cadastradas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4">
            <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-stone-900">{services.filter(s => s.active).length}</span>
              <p className="text-xs font-medium text-stone-500">Serviços Ativos</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4">
            <div className="w-12 h-12 rounded-2xl bg-verde-50 text-verde-600 flex items-center justify-center shrink-0">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-stone-900">{testimonials.length}</span>
              <p className="text-xs font-medium text-stone-500">Depoimentos</p>
            </div>
          </div>

          {/* Integration Status Badge */}
          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
            <Database className={`w-5 h-5 shrink-0 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-500'}`} />
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">
                {isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Armazenamento Local'}
              </span>
              <span className="text-[11px] text-stone-500">
                {isSupabaseConfigured ? 'Sincronização em Nuvem ativa' : 'Dados salvos localmente no navegador'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap border-b border-stone-200 gap-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'photos'
                ? 'bg-white text-verde-700 border-t-2 border-x border-verde-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gerenciar Fotos</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'services'
                ? 'bg-white text-verde-700 border-t-2 border-x border-verde-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Gerenciar Serviços</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'testimonials'
                ? 'bg-white text-verde-700 border-t-2 border-x border-verde-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Gerenciar Depoimentos</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'sections'
                ? 'bg-white text-verde-700 border-t-2 border-x border-verde-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Imagens das Seções</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-verde-700 border-t-2 border-x border-verde-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Supabase & Conexão</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'photos' && (
            <PhotoManager
              photos={photos}
              onAddPhoto={addPhoto}
              onUpdatePhoto={updatePhoto}
              onDeletePhoto={deletePhoto}
            />
          )}

          {activeTab === 'services' && (
            <ServiceManager
              services={services}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialManager
              testimonials={testimonials}
              onAddTestimonial={addTestimonial}
              onUpdateTestimonial={updateTestimonial}
              onDeleteTestimonial={deleteTestimonial}
            />
          )}

          {activeTab === 'sections' && (
            <ManageSectionImages />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6 max-w-3xl">
              <div>
                <h3 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-verde-600" />
                  Informações da Clínica (src/config/constants.ts)
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Estes dados são centralizados e utilizados em todo o site (Navbar, Footer, Localização, CTAs e WhatsApp).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-500 block">WhatsApp / Agendamentos</span>
                    <span className="text-stone-900 font-bold">{CLINIC_CONFIG.phone.whatsappFormatted}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Telefone de Contato</span>
                    <span className="text-stone-900 font-bold">{CLINIC_CONFIG.phone.contact}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Endereço</span>
                    <span className="text-stone-900 font-medium">{CLINIC_CONFIG.address.street} - {CLINIC_CONFIG.address.neighborhood}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Instagram</span>
                    <span className="text-stone-900 font-medium">{CLINIC_CONFIG.social.instagram}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-verde-600" />
                  Configuração do Supabase
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Para conectar seu banco de dados Supabase em produção, insira suas credenciais no arquivo <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono">.env.local</code> ou no painel de segredos do AI Studio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-stone-500 block">VITE_SUPABASE_URL</span>
                  <span className="text-stone-900 font-semibold break-all">
                    {import.meta.env.VITE_SUPABASE_URL || '(Não configurada - Usando armazenamento local)'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block">VITE_SUPABASE_ANON_KEY</span>
                  <span className="text-stone-900 font-semibold break-all">
                    {import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••••••' : '(Não configurada)'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block">E-mail de Administrador</span>
                  <span className="text-stone-900 font-semibold">
                    {import.meta.env.VITE_ADMIN_EMAIL || 'veiculosbcoecia@gmail.com'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-verde-50 border border-verde-200 text-verde-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-verde-800">
                  <Sparkles className="w-4 h-4" /> Estrutura de Tabelas Recomendada no Supabase:
                </div>
                <ul className="list-disc list-inside space-y-1 text-verde-800/90 pl-2">
                  <li><strong>photos</strong>: id, url, caption, category, order, created_at</li>
                  <li><strong>services</strong>: id, title, description, icon, active, order</li>
                  <li><strong>testimonials</strong>: id, author_name, pet_name, content, rating, active, created_at</li>
                  <li><strong>site_settings</strong>: id, key (unique), value, description, updated_at</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
