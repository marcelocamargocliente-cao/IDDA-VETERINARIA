import React, { useState, useEffect } from 'react'
import { 
  Lock, X, Upload, Trash2, Edit2, Plus, Check, LogOut, 
  Image as ImageIcon, ShieldCheck, Sparkles, AlertCircle, Save, Layers, MapPin
} from 'lucide-react'
import { supabase, supabaseAdmin, SB_URL, SB_SK } from '../../lib/supabase'
import { Photo, Service } from '../../types'

const BUCKET_NAME = 'idda-photos'

export const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'gallery' | 'hero' | 'services' | 'location'>('gallery')
  const [toastMessage, setToastMessage] = useState('')

  // Data states
  const [photos, setPhotos] = useState<Photo[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [heroUrl, setHeroUrl] = useState('')
  const [locationUrl, setLocationUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [newServiceForm, setNewServiceForm] = useState<{
    open: boolean; title: string; description: string; highlight: string;
    imageFile: File | null; imagePreview: string
  }>({ open: false, title: '', description: '', highlight: '', imageFile: null, imagePreview: '' })

  // Hero e Location - estado de arquivo selecionado antes de salvar
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState<string>('')
  const [locationFile, setLocationFile] = useState<File | null>(null)
  const [locationPreview, setLocationPreview] = useState<string>('')
  const [locationCaption, setLocationCaption] = useState<string>('')
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'gallery' | 'service'>('all')

  // Check URL hash for #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsOpen(true)
      }
    }
    if (window.location.hash === '#admin') {
      setIsOpen(true)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'iddaveterinaria@gmail.com' && password === 'IDDAVet2025') {
      setIsLoggedIn(true)
      setLoginError('')
      showToast('Login realizado com sucesso!')
      loadAdminData()
    } else {
      setLoginError('E-mail ou senha incorretos.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    window.location.hash = ''
    showToast('Logout realizado com sucesso.')
  }

  const loadAdminData = async () => {
    try {
      // Load photos
      const { data: photosData } = await supabase.from('photos').select('*').order('order')
      if (photosData) setPhotos(photosData)

      // Load services
      const { data: servicesData } = await supabase.from('services').select('*').order('order')
      if (servicesData) setServices(servicesData)

      // Load site_settings (hero & location)
      const { data: settingsData } = await supabase.from('site_settings').select('*')
      if (settingsData) {
        const hero = settingsData.find(s => s.key === 'hero_image')
        if (hero) setHeroUrl(hero.value)
        const loc = settingsData.find(s => s.key === 'location_image')
        if (loc) setLocationUrl(loc.value)
        const cap = settingsData.find(s => s.key === 'location_caption')
        if (cap) setLocationCaption(cap.value || '')
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
    }
  }

  // Upload helper — fetch direto (padrão Thayssa, sem SDK)
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const r = await fetch(`${SB_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`, {
      method: 'POST',
      headers: {
        'apikey': SB_SK,
        'Authorization': `Bearer ${SB_SK}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true'
      },
      body: file
    })

    if (!r.ok) {
      const txt = await r.text()
      throw new Error(`Erro no upload: ${txt}`)
    }

    return `${SB_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`
  }

  // Handle Hero Image Update
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const publicUrl = await uploadImageToSupabase(file)
      
      const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ key: 'hero_image', value: publicUrl }, { onConflict: 'key' })

      if (error) throw error

      setHeroUrl(publicUrl)
      showToast('Foto do Hero atualizada com sucesso!')
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar Hero')
    } finally {
      setUploading(false)
    }
  }

  // Handle Location Image Update
  const handleLocationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const publicUrl = await uploadImageToSupabase(file)
      
      const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ key: 'location_image', value: publicUrl }, { onConflict: 'key' })

      if (error) throw error

      setLocationUrl(publicUrl)
      showToast('Foto da Localização atualizada com sucesso!')
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar Localização')
    } finally {
      setUploading(false)
    }
  }

  // Add Photo to Gallery
  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('photo_file') as File
    const caption = formData.get('caption') as string
    const category = formData.get('category') as string

    if (!file || !file.size) {
      alert('Selecione um arquivo de imagem.')
      return
    }

    try {
      setUploading(true)
      const publicUrl = await uploadImageToSupabase(file)

      const { error } = await supabaseAdmin
        .from('photos')
        .insert([{ url: publicUrl, caption, category, order: photos.length + 1 }])

      if (error) throw error

      showToast('Foto adicionada à galeria com sucesso!')
      if (e.currentTarget) e.currentTarget.reset()
      loadAdminData()
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar foto')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return
    try {
      const { error } = await supabaseAdmin.from('photos').delete().eq('id', id)
      if (error) throw error
      showToast('Foto excluída com sucesso!')
      loadAdminData()
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir foto')
    }
  }

  // Update Service Image
  const handleServiceImageUpdate = async (serviceId: string, file: File) => {
    try {
      setUploading(true)
      const publicUrl = await uploadImageToSupabase(file)

      const { error } = await supabaseAdmin
        .from('services')
        .update({ image_url: publicUrl })
        .eq('id', serviceId)

      if (error) throw error

      showToast('Foto do serviço atualizada com sucesso!')
      loadAdminData()
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar serviço')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#6B8E6F] animate-in slide-in-from-bottom-2">
          <Check className="w-5 h-5 text-[#6B8E6F]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Floating Admin Trigger Button if not open */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            window.location.hash = '#admin'
          }}
          className="fixed bottom-6 left-6 z-40 bg-[#1A1A1A] hover:bg-[#6B8E6F] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 group border border-[#D4C5B9]/40 flex items-center gap-2 px-4"
          title="Painel Administrativo IDDA"
        >
          <Lock className="w-4 h-4 text-[#6B8E6F] group-hover:text-white transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wider">Painel Admin</span>
        </button>
      )}

      {/* Admin Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#FFFFFF] h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#D4C5B9]">
            
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#6B8E6F] flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-heading font-bold text-lg">Painel Administrativo IDDA</h3>
                  <p className="text-xs text-[#A3998F]">Gerenciamento de Fotos & Conteúdo do Site</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false)
                  if (window.location.hash === '#admin') window.location.hash = ''
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F5F1ED]">
              {!isLoggedIn ? (
                <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-sm border border-[#D4C5B9] space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto text-[#6B8E6F] border border-[#D4C5B9]">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif-heading font-bold text-xl text-[#1A1A1A]">Acesso Restrito</h4>
                    <p className="text-xs text-[#4A4A4A]">Entre com as credenciais administrativas da IDDA Veterinária.</p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="iddaveterinaria@gmail.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#D4C5B9] text-sm focus:outline-none focus:border-[#6B8E6F] bg-[#F5F1ED]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Senha</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#D4C5B9] text-sm focus:outline-none focus:border-[#6B8E6F] bg-[#F5F1ED]/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Entrar no Painel
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Tabs Navigation */}
                  <div className="flex bg-white p-1 rounded-2xl border border-[#D4C5B9] shadow-2xs">
                    {[
                      { id: 'gallery', label: 'Galeria', icon: ImageIcon },
                      { id: 'hero', label: 'Hero (Topo)', icon: Sparkles },
                      { id: 'services', label: 'Serviços', icon: Layers },
                      { id: 'location', label: 'Localização', icon: MapPin },
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            activeTab === tab.id
                              ? 'bg-[#6B8E6F] text-white shadow-sm'
                              : 'text-[#4A4A4A] hover:bg-[#F5F1ED]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* TAB 1: GALERIA */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl border border-[#D4C5B9] shadow-sm">
                        <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-[#6B8E6F]" />
                          <span>Adicionar Nova Foto à Galeria</span>
                        </h4>

                        <form onSubmit={handleAddPhoto} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Arquivo de Imagem</label>
                            <input
                              type="file"
                              name="photo_file"
                              accept="image/*"
                              required
                              className="w-full text-xs text-[#4file] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F5F1ED] file:text-[#6B8E6F] hover:file:bg-[#D4C5B9]/40 cursor-pointer"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Legenda / Descrição</label>
                              <input
                                type="text"
                                name="caption"
                                placeholder="Ex: Recepção e Sala de Espera"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B9] text-xs focus:outline-none focus:border-[#6B8E6F]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">Categoria</label>
                              <select
                                name="category"
                                defaultValue="gallery"
                                className="w-full px-4 py-2.5 rounded-xl border border-[#D4C5B9] text-xs focus:outline-none focus:border-[#6B8E6F] bg-white"
                              >
                                <option value="gallery">Estrutura & Clínica (Galeria)</option>
                                <option value="service">Equipamentos & Procedimentos</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? 'Enviando para o Supabase...' : 'Enviar e Adicionar Foto'}</span>
                          </button>
                        </form>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-[#D4C5B9] shadow-sm space-y-4">
                        
                        {/* Header com contador e filtro por categoria */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A]">
                            Fotos Cadastradas ({photos.length})
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { id: 'all', label: 'Todas', color: 'bg-stone-700 text-white' },
                              { id: 'gallery', label: '🏥 Estrutura', color: 'bg-emerald-600 text-white' },
                              { id: 'service', label: '⚙️ Equipamentos', color: 'bg-blue-600 text-white' },
                            ].map((f) => (
                              <button
                                key={f.id}
                                onClick={() => setGalleryFilter(f.id as any)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                                  galleryFilter === f.id
                                    ? f.color + ' shadow-sm'
                                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                }`}
                              >
                                {f.label} ({f.id === 'all' ? photos.length : photos.filter(p => p.category === f.id).length})
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Grid de fotos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {photos
                            .filter(p => galleryFilter === 'all' || p.category === galleryFilter)
                            .map((photo) => {
                              const catLabel = photo.category === 'gallery' ? 'Estrutura & Clínica'
                                : photo.category === 'service' ? 'Equipamentos & Procedimentos'
                                : photo.category || 'Geral'
                              const catColor = photo.category === 'gallery' ? 'bg-emerald-600'
                                : photo.category === 'service' ? 'bg-blue-600'
                                : 'bg-stone-600'
                              const catIcon = photo.category === 'gallery' ? '🏥'
                                : photo.category === 'service' ? '⚙️' : '📷'

                              return (
                                <div key={photo.id} className="bg-[#F5F1ED] rounded-2xl overflow-hidden border border-[#D4C5B9] flex flex-col justify-between group">
                                  <div className="relative aspect-[16/10]">
                                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                                    
                                    {/* Badge de categoria — claro, colorido, identificável */}
                                    <span className={`absolute top-2 left-2 ${catColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                                      <span>{catIcon}</span>
                                      <span>{catLabel}</span>
                                    </span>

                                    {/* Botão deletar — aparece no hover */}
                                    <button
                                      onClick={() => handleDeletePhoto(photo.id)}
                                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-700"
                                      title="Excluir foto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="p-3.5 flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">{catLabel}</p>
                                      <p className="text-xs font-medium text-[#1A1A1A] truncate">{photo.caption || 'Sem legenda'}</p>
                                    </div>
                                    <button
                                      onClick={() => handleDeletePhoto(photo.id)}
                                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors shrink-0 border border-red-200"
                                      title="Excluir foto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>

                        {photos.filter(p => galleryFilter === 'all' || p.category === galleryFilter).length === 0 && (
                          <div className="text-center py-10 text-stone-400 text-sm">
                            Nenhuma foto nesta categoria ainda.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HERO */}
                  {activeTab === 'hero' && (
                    <div className="bg-white p-6 rounded-3xl border border-[#D4C5B9] shadow-sm space-y-6">
                      <div>
                        <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A] mb-1">Foto Principal do Hero (Topo)</h4>
                        <p className="text-xs text-[#4A4A4A]">Altere a imagem principal exibida no topo do site para todos os visitantes.</p>
                      </div>

                      <div className="space-y-4">
                        {/* Preview atual ou nova */}
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-[#D4C5B9]">
                          <img
                            src={heroPreview || heroUrl || ''}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                          {heroPreview && (
                            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              Nova foto selecionada
                            </div>
                          )}
                        </div>

                        {/* Badge de tamanho */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                          <span className="text-amber-500">📐</span>
                          <span className="text-[11px] font-bold text-amber-800">Tamanho ideal: 900 × 840 px  |  Proporção 1:1 ou 9:10  |  Foto vertical/quadrada</span>
                        </div>

                        {/* Seletor de arquivo */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#6B8E6F] hover:border-[#5A7A5F] bg-[#F5F1ED] hover:bg-[#6B8E6F]/5 rounded-2xl p-5 cursor-pointer transition-all">
                          <Upload className="w-6 h-6 text-[#6B8E6F] mb-2" />
                          <span className="text-xs font-bold text-stone-800">
                            {heroFile ? heroFile.name : 'Clique para escolher nova foto do Hero'}
                          </span>
                          <span className="text-[11px] text-stone-500 mt-1">JPG, PNG, WebP — máx. 12MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setHeroFile(file)
                              const reader = new FileReader()
                              reader.onload = (ev) => setHeroPreview(ev.target?.result as string)
                              reader.readAsDataURL(file)
                            }}
                          />
                        </label>

                        {/* Botão Salvar — só aparece quando tem arquivo selecionado */}
                        {heroFile && (
                          <button
                            disabled={uploading}
                            onClick={async () => {
                              if (!heroFile) return
                              try {
                                setUploading(true)
                                const publicUrl = await uploadImageToSupabase(heroFile)
                                const { error } = await supabaseAdmin
                                  .from('site_settings')
                                  .upsert({ key: 'hero_image', value: publicUrl }, { onConflict: 'key' })
                                if (error) throw error
                                setHeroUrl(publicUrl)
                                setHeroFile(null)
                                setHeroPreview('')
                                showToast('✅ Foto do Hero salva com sucesso!')
                              } catch (err: any) {
                                alert(err.message || 'Erro ao salvar Hero')
                              } finally {
                                setUploading(false)
                              }
                            }}
                            className="w-full bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
                          >
                            {uploading ? (
                              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando foto...</>
                            ) : (
                              <><Save className="w-4 h-4" />Salvar Foto do Hero</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SERVIÇOS */}
                  {activeTab === 'services' && (
                    <div className="bg-white p-6 rounded-3xl border border-[#D4C5B9] shadow-sm space-y-6">
                      {/* Header com botão Novo Serviço */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A] mb-1">Gerenciar Fotos dos Serviços</h4>
                          <p className="text-xs text-[#4A4A4A]">Altere fotos, edite ou adicione novos serviços da clínica.</p>
                        </div>
                        <button
                          onClick={() => setNewServiceForm({ open: true, title: '', description: '', highlight: '', imageFile: null, imagePreview: '' })}
                          className="flex items-center gap-2 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Novo Serviço
                        </button>
                      </div>

                      {/* Form de novo serviço */}
                      {newServiceForm.open && (
                        <div className="bg-[#F5F1ED] rounded-2xl border border-[#D4C5B9] p-5 space-y-4">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-sm text-[#1A1A1A]">Cadastrar Novo Serviço</h5>
                            <button onClick={() => setNewServiceForm({ open: false, title: '', description: '', highlight: '', imageFile: null, imagePreview: '' })} className="text-stone-400 hover:text-stone-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Preview da foto */}
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                            {newServiceForm.imagePreview ? (
                              <img src={newServiceForm.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs gap-1">
                                <ImageIcon className="w-8 h-8" />
                                <span>Nenhuma foto selecionada</span>
                              </div>
                            )}
                          </div>

                          {/* Upload da foto */}
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#6B8E6F] bg-white rounded-xl p-4 cursor-pointer hover:bg-[#6B8E6F]/5 transition-all">
                            <Upload className="w-5 h-5 text-[#6B8E6F] mb-1" />
                            <span className="text-xs font-bold text-stone-800">
                              {newServiceForm.imageFile ? newServiceForm.imageFile.name : 'Clique para selecionar foto'}
                            </span>
                            <span className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WebP — máx. 12MB</span>
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg mt-2 font-bold">
                              📐 Ideal: 1200 × 675 px | Proporção 16:9
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = (ev) => setNewServiceForm(prev => ({ ...prev, imageFile: file, imagePreview: ev.target?.result as string }))
                                reader.readAsDataURL(file)
                              }}
                            />
                          </label>

                          {/* Título */}
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Título do Serviço *</label>
                            <input
                              type="text"
                              value={newServiceForm.title}
                              onChange={(e) => setNewServiceForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Ex: Acupuntura Veterinária"
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] text-stone-800"
                            />
                          </div>

                          {/* Destaque */}
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Destaque / Badge (opcional)</label>
                            <input
                              type="text"
                              value={newServiceForm.highlight}
                              onChange={(e) => setNewServiceForm(prev => ({ ...prev, highlight: e.target.value }))}
                              placeholder="Ex: Novo, 24 Horas, Especialista"
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] text-stone-800"
                            />
                          </div>

                          {/* Descrição */}
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Descrição *</label>
                            <textarea
                              rows={3}
                              value={newServiceForm.description}
                              onChange={(e) => setNewServiceForm(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Descreva o serviço oferecido pela clínica..."
                              className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] text-stone-800 leading-relaxed"
                            />
                          </div>

                          {/* Botões */}
                          <div className="flex gap-3 pt-1">
                            <button
                              onClick={() => setNewServiceForm({ open: false, title: '', description: '', highlight: '', imageFile: null, imagePreview: '' })}
                              className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              disabled={uploading || !newServiceForm.title.trim() || !newServiceForm.description.trim()}
                              onClick={async () => {
                                if (!newServiceForm.title.trim() || !newServiceForm.description.trim()) return
                                setUploading(true)
                                try {
                                  let imageUrl = ''
                                  if (newServiceForm.imageFile) {
                                    const fileName = `services/service-new-${Date.now()}.jpg`
                                    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET_NAME).upload(fileName, newServiceForm.imageFile, { upsert: true })
                                    if (!upErr) {
                                      const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName)
                                      imageUrl = urlData.publicUrl
                                    }
                                  }
                                  const { error } = await supabaseAdmin.from('services').insert([{
                                    title: newServiceForm.title,
                                    description: newServiceForm.description,
                                    highlight: newServiceForm.highlight,
                                    image_url: imageUrl,
                                    icon: 'Stethoscope',
                                    active: true,
                                    order: services.length + 1,
                                    order_display: services.length + 1
                                  }])
                                  if (error) throw error
                                  showToast('✅ Novo serviço cadastrado com sucesso!')
                                  setNewServiceForm({ open: false, title: '', description: '', highlight: '', imageFile: null, imagePreview: '' })
                                  loadAdminData()
                                } catch (err: any) {
                                  showToast('Erro: ' + err.message)
                                } finally {
                                  setUploading(false)
                                }
                              }}
                              className="flex-1 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {uploading ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Salvando...</> : <><Check className="w-4 h-4" />Cadastrar Serviço</>}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Lista de serviços existentes */}
                      <div className="space-y-4">
                        {services.map((service) => (
                          <div key={service.id} className="p-4 bg-[#F5F1ED] rounded-2xl border border-[#D4C5B9] flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-24 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                              <img src={service.image_url || service.image} alt={service.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 text-center sm:text-left">
                              <h5 className="font-bold text-sm text-[#1A1A1A]">{service.title}</h5>
                              <p className="text-xs text-[#4A4A4A] truncate mt-0.5">{service.description}</p>
                              {service.highlight && <span className="inline-block mt-1 bg-[#6B8E6F]/10 text-[#6B8E6F] text-[10px] font-bold px-2 py-0.5 rounded-full">{service.highlight}</span>}
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Alterar Foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleServiceImageUpdate(service.id, file)
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => { if (confirm(`Excluir "${service.title}"?`)) { supabaseAdmin.from('services').delete().eq('id', service.id).then(() => { showToast('Serviço excluído.'); loadAdminData() }) } }}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir serviço"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LOCALIZAÇÃO */}
                  {activeTab === 'location' && (
                    <div className="bg-white p-6 rounded-3xl border border-[#D4C5B9] shadow-sm space-y-6">
                      <div>
                        <h4 className="font-serif-heading font-bold text-lg text-[#1A1A1A] mb-1">Foto da Seção Localização</h4>
                        <p className="text-xs text-[#4A4A4A]">Atualize a foto da fachada ou estrutura exibida na seção de localização.</p>
                      </div>

                      <div className="space-y-4">
                        {/* Preview atual ou nova */}
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-[#D4C5B9]">
                          <img
                            src={locationPreview || locationUrl || ''}
                            alt="Location Preview"
                            className="w-full h-full object-cover"
                          />
                          {locationPreview && (
                            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              Nova foto selecionada
                            </div>
                          )}
                        </div>

                        {/* Badge de tamanho */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                          <span className="text-amber-500">📐</span>
                          <span className="text-[11px] font-bold text-amber-800">Tamanho ideal: 1200 × 675 px  |  Proporção 16:9  |  Foto horizontal da fachada/clínica</span>
                        </div>

                        {/* Seletor de arquivo */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#6B8E6F] hover:border-[#5A7A5F] bg-[#F5F1ED] hover:bg-[#6B8E6F]/5 rounded-2xl p-5 cursor-pointer transition-all">
                          <Upload className="w-6 h-6 text-[#6B8E6F] mb-2" />
                          <span className="text-xs font-bold text-stone-800">
                            {locationFile ? locationFile.name : 'Clique para escolher nova foto de Localização'}
                          </span>
                          <span className="text-[11px] text-stone-500 mt-1">JPG, PNG, WebP — máx. 12MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setLocationFile(file)
                              const reader = new FileReader()
                              reader.onload = (ev) => setLocationPreview(ev.target?.result as string)
                              reader.readAsDataURL(file)
                            }}
                          />
                        </label>

                        {/* Botão Salvar — só aparece quando tem arquivo selecionado */}
                        {locationFile && (
                          <button
                            disabled={uploading}
                            onClick={async () => {
                              if (!locationFile) return
                              try {
                                setUploading(true)
                                const publicUrl = await uploadImageToSupabase(locationFile)
                                const { error } = await supabaseAdmin
                                  .from('site_settings')
                                  .upsert({ key: 'location_image', value: publicUrl }, { onConflict: 'key' })
                                if (error) throw error
                                setLocationUrl(publicUrl)
                                setLocationFile(null)
                                setLocationPreview('')
                                showToast('✅ Foto da Localização salva com sucesso!')
                              } catch (err: any) {
                                alert(err.message || 'Erro ao salvar Localização')
                              } finally {
                                setUploading(false)
                              }
                            }}
                            className="w-full bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
                          >
                            {uploading ? (
                              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando foto...</>
                            ) : (
                              <><Save className="w-4 h-4" />Salvar Foto da Localização</>
                            )}
                          </button>
                        )}

                        {/* Campo de Legenda da foto */}
                        <div className="border-t border-[#D4C5B9] pt-5 space-y-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                              Legenda da Foto (texto sobre a imagem)
                            </label>
                            <p className="text-[11px] text-stone-500 mb-3">
                              Este texto aparece sobreposto na parte inferior da foto. Deixe vazio para não exibir legenda.
                            </p>
                            <input
                              type="text"
                              value={locationCaption}
                              onChange={(e) => setLocationCaption(e.target.value)}
                              placeholder="Ex: Pronta para cuidar do seu pet"
                              className="w-full px-4 py-3 text-sm bg-white border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] text-stone-800"
                            />
                          </div>
                          <button
                            disabled={uploading}
                            onClick={async () => {
                              try {
                                setUploading(true)
                                const { error } = await supabaseAdmin
                                  .from('site_settings')
                                  .upsert({ key: 'location_caption', value: locationCaption }, { onConflict: 'key' })
                                if (error) throw error
                                showToast('✅ Legenda salva com sucesso!')
                              } catch (err: any) {
                                alert(err.message || 'Erro ao salvar legenda')
                              } finally {
                                setUploading(false)
                              }
                            }}
                            className="w-full bg-stone-700 hover:bg-stone-800 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                          >
                            <Save className="w-4 h-4" />
                            Salvar Legenda
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-[#D4C5B9] flex justify-end">
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-red-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair do Painel Admin</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
