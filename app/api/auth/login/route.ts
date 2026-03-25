import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    // 1. Validar el body con Zod
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // 2. Crear cliente Supabase (Server Component / Route Handler)
    const supabase = await createClient()

    // 3. Iniciar sesión en Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      return NextResponse.json(
        { error: 'Credenciales inválidas o cuenta no confirmada' }, 
        { status: 401 }
      )
    }

    // 4. Intentar obtener el perfil de la tabla 'profiles'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // 5. Manejo inteligente: Si no hay perfil en la tabla, usamos los metadatos de Auth
    // Esto evita que el login falle si el Trigger de la DB tardó unos milisegundos
    const finalProfile = profile || {
      full_name: data.user.user_metadata?.full_name,
      role: data.user.user_metadata?.role,
      student_code: data.user.user_metadata?.student_code,
      phone: data.user.user_metadata?.phone,
    }

    // 6. Respuesta Exitosa
    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: data.user,
      profile: finalProfile,
    }, { status: 200 })

  } catch (error: any) {
    // Manejo de errores de validación de Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos de entrada no válidos', details: error.errors },
        { status: 400 }
      )
    }

    // Error genérico del servidor
    console.error('Login Error:', error)
    return NextResponse.json(
      { error: 'Error interno al procesar el inicio de sesión' },
      { status: 500 }
    )
  }
}