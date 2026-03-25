import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { equipmentSchema } from '@/lib/validations/equipment'

interface Equipment {
  code: string
  name: string
  description?: string
  category_id?: string
  brand?: string
  model?: string
  serial_number?: string
  status: string
  condition: string
  purchase_date?: string
  location: string
  image_url?: string
  notes?: string
  created_by: string
}

// GET - Listar todos los equipos
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    let query = supabase
      .from('equipment')
      .select(`
        *,
        category:categories(id, name, icon),
        creator:profiles!equipment_created_by_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Crear nuevo equipo
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que sea manager
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
    const validatedData = equipmentSchema.parse(body)

    const { data, error } = await (supabase
      .from('equipment') as any)
      .insert({
        code: validatedData.code,
        name: validatedData.name,
        description: validatedData.description,
        category_id: validatedData.categoryId,
        brand: validatedData.brand,
        model: validatedData.model,
        serial_number: validatedData.serialNumber,
        status: validatedData.status,
        condition: validatedData.condition,
        purchase_date: validatedData.purchaseDate,
        location: validatedData.location,
        image_url: validatedData.imageUrl,
        notes: validatedData.notes,
        created_by: user.id,
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