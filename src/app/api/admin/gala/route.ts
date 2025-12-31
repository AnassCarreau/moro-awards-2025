import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Revelar ganador/posición
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  
  const body = await request.json()
  const { finalist_id, action, position } = body
  
  const adminClient = createAdminClient()
  
  if (action === 'reveal') {
    const { data, error } = await adminClient
      .from('finalists')
      .update({
        is_revealed: true,
        revealed_at: new Date().toISOString(),
        final_position: position,
      })
      .eq('id', finalist_id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }
  
  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}

// Cambiar fase del evento
export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  
  const body = await request.json()
  const { phase, gala_active, results_public } = body
  
  const adminClient = createAdminClient()
  
  const updateData: any = { updated_at: new Date().toISOString() }
  if (phase) updateData.current_phase = phase
  if (typeof gala_active === 'boolean') updateData.gala_active = gala_active
  if (typeof results_public === 'boolean') updateData.results_public = results_public
  
  const { data, error } = await adminClient
    .from('event_config')
    .update(updateData)
    .eq('id', 1)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}