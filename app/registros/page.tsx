// app/register/page.tsx
"use client";

import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden py-12">
      
      {/* Luces de fondo (Atmósfera NOCTU) - Igual que el Login */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl px-6 animate-in fade-in zoom-in duration-500">
        
        {/* Encabezado Estilo Noctu */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            SIG • Registro de Usuario
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">
            ÚNETE A NOCTU<span className="text-yellow-500">.</span>
          </h1>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Crea tu perfil para acceder a filtros avanzados y gestión de laboratorios
          </p>
        </div>

        {/* Contenedor Principal (Glassmorphism) */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
          <RegisterForm />
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-medium">
              ¿Ya eres parte de la red?{' '}
              <Link 
                href="/login" 
                className="text-white hover:text-yellow-500 font-bold transition-colors underline underline-offset-8 decoration-yellow-500/30 hover:decoration-yellow-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Técnico */}
        <div className="text-center mt-10 opacity-30">
          <p className="text-slate-500 text-[9px] uppercase tracking-[0.4em] font-bold">
            Ingeniería de Sistemas • EMI 2026
          </p>
        </div>
      </div>
    </div>
  )
}