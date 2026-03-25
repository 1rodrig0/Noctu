import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { equipmentSchema } from '@/lib/validations/equipment'
import type { Database } from '@/lib/types/database.types'

// GET - Obtener equipo por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Se mantiene el patrón Promise<{id: string}>
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('equipment')
      .select(`
        *,
        category:categories(id, name, icon),
        creator:profiles!equipment_created_by_fkey(id, full_name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Actualizar equipo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Se mantiene el patrón Promise<{id: string}>
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Corregido: Usamos el tipado para obtener la estructura del perfil
    type ProfileSelect = { role: string }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<ProfileSelect>()

    if (profile?.role !== 'lab_manager') {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar equipos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = equipmentSchema.parse(body)

    // ⬅️ CORRECCIÓN CLAVE: Removemos el casting forzado para evitar el error 'never'
    // La estructura de la actualización es compatible con el tipo Update de Supabase
    // En la función PUT, reemplaza el bloque de definición de updateData

    const updateData: Database['public']['Tables']['equipment']['Update'] = {
      code: validatedData.code,
      name: validatedData.name,
      // Usamos el operador ternario para asegurarnos de que solo pasamos 
      // la propiedad si tiene valor (undefined), o null si es vacío.
      // La clave es que los campos opcionales del esquema Supabase
      // deben ser 'undefined' para omitir la actualización.
      description: validatedData.description ?? null,
      category_id: validatedData.categoryId ?? null,
      brand: validatedData.brand ?? null,
      model: validatedData.model ?? null,
      serial_number: validatedData.serialNumber ?? null,
      status: validatedData.status, // Los campos requeridos no deben ser null
      condition: validatedData.condition, // Los campos requeridos no deben ser null
      purchase_date: validatedData.purchaseDate ?? null,
      location: validatedData.location, // Los campos requeridos no deben ser null
      image_url: validatedData.imageUrl ?? null,
      notes: validatedData.notes ?? null,
    } 

    const { data: updatedEquipment, error: updateError } = await (supabase
      .from('equipment') as any)
      .update(updateData) // ⬅️ Debería funcionar ahora
      .eq('id', id)
      .select()
      .maybeSingle()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json(updatedEquipment)
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

// DELETE - Eliminar equipo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Se mantiene el patrón Promise<{id: string}>
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Corregido: Usamos el tipado para obtener la estructura del perfil
    type ProfileSelect = { role: string }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<ProfileSelect>()

    if (profile?.role !== 'lab_manager') {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar equipos' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Equipo eliminado exitosamente' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ----------------------------------------------------
// Código de listado (GET general) y creación (POST)
// ----------------------------------------------------

// Nota: He movido tu GET y POST originales al final para consistencia, 
// asumiendo que este es un archivo de manejo de ruta dinámica [id]/route.ts/js.

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

// GET - Listar todos los equipos (Asumo que este código es de un archivo diferente: /equipment/route.ts/js)
export async function GET_ALL(request: Request) { // Renombrado a GET_ALL para evitar conflicto
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

// POST - Crear nuevo equipo (Asumo que este código es de un archivo diferente: /equipment/route.ts/js)
export async function POST_CREATE(request: Request) { // Renombrado a POST_CREATE para evitar conflicto
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que sea manager
    type ProfileSelect = { role: string }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<ProfileSelect>()

    if (profile?.role !== 'lab_manager') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear equipos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = equipmentSchema.parse(body)

    // ⬅️ CORRECCIÓN: Eliminamos el 'as any' innecesario
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