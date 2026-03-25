
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function POST(
  request: Request,
   { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>()

    if (profile?.role !== 'lab_manager') {
      return NextResponse.json(
        { error: 'No tienes permisos para aprobar préstamos' },
        { status: 403 }
      )
    }

    const now = new Date().toISOString()

    type Loan = {
      id: string
      status: string
      approved_at?: string
      approved_by?: string
      loan_start_date?: string
    }

    interface LoanUpdate {
      status: string
      approved_at: string
      approved_by: string
      loan_start_date: string
    }

    const { data, error } = await (supabase
      .from('loans') as any)
      .update({
        status: 'approved',
        approved_at: now,
        approved_by: user.id,
        loan_start_date: now,
      })
      .eq('id', (await params).id)
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}