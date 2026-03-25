"use client";

import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    // Cambiamos bg-gray-50 por bg-slate-950 para el look nocturno
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black text-center text-yellow-500">
            NOCTU SIG
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Ingresa para explorar la vida nocturna de La Paz
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* El formulario sigue siendo el mismo, no necesitas tocar su lógica interna */}
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-yellow-500 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}