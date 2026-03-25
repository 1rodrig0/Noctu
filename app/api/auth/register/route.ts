// app/api/auth/register/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // app/api/auth/register/route.ts
const { data, error: authError } = await supabase.auth.signUp({
  email: body.email,
  password: body.password,
  options: {
    data: {
      full_name: body.fullName,
      role: body.role,
      document_id: body.documentId, // Se mapea a document_id en el SQL
      phone: body.phone,
    },
  },
})

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', user: data.user },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 })
  }
}