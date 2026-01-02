import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/players/[id]
 * 
 * Returns a single player by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: player, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json(player)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

