import React, { useState } from 'react'
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react'

interface AdminLoginProps {
  onLoginSuccess: () => void
  onClose: () => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'veiculosbcoecia@gmail.com'
  const defaultAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'idda2025'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    setTimeout(() => {
      // Validate credentials against env or fallback defaults
      if (
        email.trim().toLowerCase() === defaultAdminEmail.trim().toLowerCase() && 
        password === defaultAdminPassword
      ) {
        onLoginSuccess()
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais de administrador.')
      }
      setLoading(false)
    }, 400)
  }

  const fillDefaultCredentials = () => {
    setEmail(defaultAdminEmail)
    setPassword(defaultAdminPassword)
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao site
          </button>
          
          <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
            Área Restrita
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-verde-100 text-verde-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Painel Administrativo</h2>
          <p className="text-xs text-stone-500 mt-1">
            Gestão de fotos, serviços e depoimentos da IDDA Veterinária
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="veiculosbcoecia@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-verde-500 focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-verde-500 focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-verde-600 hover:bg-verde-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Acessando...' : 'Entrar no Painel'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="text-xs text-verde-600 hover:text-verde-700 font-medium underline"
          >
            Preencher credenciais padrão para teste
          </button>
        </div>

      </div>
    </div>
  )
}
