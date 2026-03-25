import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          role: validatedData.role,
          student_code: validatedData.studentCode,
          phone: validatedData.phone,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: data.user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validación fallida', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}