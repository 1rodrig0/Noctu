// app/api/loans/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { loanRequestSchema } from '@/lib/validations/loan'

// ========================================================
// GET - Listar préstamos
// ========================================================
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener rol del usuario
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{
     role: 'student' | 'lab_manager' | string | null
    }>()


    // Leer parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Consulta base
    let query = supabase
      .from('loans')
      .select(`
        *,
        equipment:equipment(id, code, name, brand, model),
        student:profiles!loans_student_id_fkey(id, full_name, student_code, email),
        approver:profiles!loans_approved_by_fkey(id, full_name),
        rejecter:profiles!loans_rejected_by_fkey(id, full_name),
        returner:profiles!loans_returned_to_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false })

    // Filtro por rol: estudiantes solo ven sus préstamos
    if (profile?.role === 'student') {
      query = query.eq('student_id', user.id)
    }

    // Filtro por estado si existe
    if (status) {
      query = query.eq('status', status)
    }

    // Ejecutar consulta
    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ========================================================
// POST - Crear una solicitud de préstamo
// ========================================================
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Obtener usuario
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Validación del body
    const body = await request.json()
    const validatedData = loanRequestSchema.parse(body)

    // Verificar disponibilidad del equipo
    const { data: equipment } = await (supabase
      .from('equipment') as any)    
      .select('status')
      .eq('id', validatedData.equipmentId)
      .single()

    if (equipment?.status !== 'available') {
      return NextResponse.json(
        { error: 'El equipo no está disponible' },
        { status: 400 }
      )
    }

    // Insertar el préstamo
    const { data, error } = await (supabase
      .from('loans') as any)    
      .insert({
        equipment_id: validatedData.equipmentId,
        student_id: user.id,
        purpose: validatedData.purpose,
        expected_return_date: validatedData.expectedReturnDate,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { error: 'Validación fallida', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
