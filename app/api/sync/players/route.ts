import { NextResponse } from 'next/server'
import { syncPlayersFromAPI } from '@/lib/api/sync-players'

/**
 * POST /api/sync/players
 * 
 * Syncs players from API-Football to Supabase database
 * This endpoint fetches live data and updates the players table
 */
export async function POST() {
  try {
    console.log('[Sync Endpoint] Starting sync...')
    const result = await syncPlayersFromAPI()
    console.log('[Sync Endpoint] Result:', result)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Synced ${result.successful} players successfully`,
        total: result.total,
        successful: result.successful,
        errors: result.errors
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Sync failed',
          total: result.total || 0,
          successful: result.successful || 0,
          errors: result.errors || 0
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Sync Endpoint] Fatal error:', error)
    console.error('[Sync Endpoint] Stack:', error.stack)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync players',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

