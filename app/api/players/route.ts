import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/players
 * 
 * Returns all available players with current market data
 * Fetches from Supabase database (which can be synced from API-Football)
 * 
 * Query params:
 * - sync: boolean (optional) - If true, syncs from API-Football first
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shouldSync = searchParams.get('sync') === 'true'
    
    // Optionally sync from API-Football first
    if (shouldSync) {
      try {
        const { syncPlayersFromAPI } = await import('@/lib/api/sync-players')
        await syncPlayersFromAPI()
      } catch (syncError) {
        console.error('Sync error (continuing with existing data):', syncError)
        // Continue with existing data even if sync fails
      }
    }
    
    const supabase = await createClient()
    
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching players:', error)
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: players || [],
      count: players?.length || 0,
      synced: shouldSync
    })
  } catch (error: any) {
    console.error('Failed to fetch players:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch players',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

