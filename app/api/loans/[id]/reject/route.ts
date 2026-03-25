 
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { loanRejectionSchema } from '@/lib/validations/loan'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    interface ProfileRow {
      role?: string | null
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<ProfileRow>()

    if (profile?.role !== 'lab_manager') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear equipos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = loanRejectionSchema.parse(body)

    const { data, error } = await (supabase
      .from('loans') as any)
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: user.id,
        rejection_reason: validatedData.rejectionReason,
      })
      .eq('id', params.id)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Préstamo no encontrado o ya procesado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
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