// app/api/auth/logout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Crear cliente Supabase (igual que en register/login)
    const supabase = await createClient()

    // Cerrar sesión
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: 'Error al cerrar sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno al cerrar sesión' },
      { status: 500 }
    )
  }
}
