"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react' 

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Inicializamos siempre con strings vacíos para evitar el error de "uncontrolled input"
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas')
      }

      router.push('/mapa')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-500 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Input de Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Email</Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="usuario@noctu.com"
            className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-white rounded-xl"
            // CRÍTICO: El || '' evita el error de componente no controlado
            value={formData.email || ''} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Input de Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <Label htmlFor="password" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Password</Label>
          <button type="button" className="text-[10px] text-yellow-500/60 hover:text-yellow-500 transition-colors tracking-tight">Recuperar</button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="bg-slate-950/50 border-white/5 pl-11 pr-11 h-12 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-white rounded-xl"
            // CRÍTICO: El || '' evita el error de componente no controlado
            value={formData.password || ''} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-2 space-y-6">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black h-12 rounded-xl shadow-[0_10px_20px_rgba(234,179,8,0.15)] hover:shadow-[0_10px_25px_rgba(234,179,8,0.3)] transition-all duration-300 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'INICIAR SESIÓN'}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">o</span></div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-[11px] font-medium tracking-tight">
            ¿No tienes acceso todavía?{' '}
            <Link 
              href="/registros" 
              className="text-white hover:text-yellow-500 font-bold transition-colors underline underline-offset-8 decoration-yellow-500/30 hover:decoration-yellow-500"
            >
              Registrarse para obtener beneficios
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}