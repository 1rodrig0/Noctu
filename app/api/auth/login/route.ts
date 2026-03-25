// app/api/auth/login/route.ts
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    // Validar el body
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Crear cliente Supabase server (exactamente igual que en register)
    const supabase = await createClient()

    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' }, 
        { status: 401 }
      )
    }

    // Obtener perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'No se pudo obtener el perfil del usuario' },
        { status: 500 }
      )
    }

    // Respuesta OK
    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: data.user,
      profile,
    })

  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validación fallida', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
