// app/lading/page.tsx
"use client";

import LoginForm from '@/components/auth/LoginForm'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function LadingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Botón de Volver - Esquina Superior Izquierda */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 z-50 group flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-300"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/10 transition-all">
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Inicio</span>
      </button>

      {/* Luces de fondo (Glow effects) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Sistema de Información Geográfica
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">
            NOCTU<span className="text-yellow-500">.</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Acceso restringido para aburridos</p>
        </div>

        {/* Tarjeta con efecto Glassmorphism */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
          <LoginForm />
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-10 uppercase tracking-[0.3em]">
          EMI • Ingeniería de Sistemas • 2026
        </p>
      </div>
    </div>
  )
}