"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Lock, Phone, CreditCard, ShieldCheck, ChevronLeft, Building2 } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'client' as 'client' | 'owner',
    documentId: '', // CI para clientes, Licencia para dueños
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrarse')

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => router.push('/')}
        className="absolute -top-16 -left-4 z-50 group flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-300"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/10 transition-all">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Regresar</span>
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {error && (
          <Alert variant="destructive" className="col-span-full bg-red-500/10 border-red-500/50 text-red-500 animate-in fade-in zoom-in duration-300">
            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 col-span-full">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Nombre Completo</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <Input
              type="text"
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Email de Registro</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <Input
              type="email"
              placeholder="ejemplo@correo.com"
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl text-xs"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Rol en NOCTU</Label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <select
              className="flex h-12 w-full rounded-xl border border-white/5 bg-slate-950/50 pl-11 pr-4 py-2 text-xs text-white focus:border-yellow-500/50 focus:outline-none focus:ring-1 focus:ring-yellow-500/20 appearance-none transition-all cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'owner' })}
            >
              <option value="client" className="bg-slate-900">NightMaster (Cliente)</option>
              <option value="owner" className="bg-slate-900">Dueño de Establecimiento</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 col-span-full md:col-span-1 animate-in fade-in slide-in-from-top-1">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">
            {formData.role === 'client' ? 'Cédula de Identidad' : 'Licencia de Funcionamiento / ID'}
          </Label>
          <div className="relative group">
            {formData.role === 'client' ? (
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            ) : (
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            )}
            <Input
              type="text"
              placeholder={formData.role === 'client' ? "CI: 1234567" : "LIC-990-LPZ"}
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl"
              value={formData.documentId}
              onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2 col-span-full md:col-span-1">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Celular de Contacto</Label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <Input
              type="tel"
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="col-span-full py-2">
           <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Contraseña</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <Input
              type="password"
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Confirmar</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
            <Input
              type="password"
              className="bg-slate-950/50 border-white/5 pl-11 h-12 focus:border-yellow-500/50 text-white rounded-xl"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="col-span-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black h-14 rounded-xl shadow-xl shadow-yellow-500/10 transition-all active:scale-[0.98] border-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>CREANDO PERFIL NOCTU...</span>
            </div>
          ) : (
            'UNIRSE A LA RED NOCTU'
          )}
        </Button>
      </form>
    </div>
  )
}