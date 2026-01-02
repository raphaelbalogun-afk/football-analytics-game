import { NextResponse } from 'next/server'
import { getLeaguePlayers } from '@/lib/api/football-api'

/**
 * GET /api/test-sync
 * 
 * Simple test endpoint to debug sync issues
 */
export async function GET() {
  try {
    console.log('[Test] Starting API test...')
    
    // Test 1: Check API key
    const apiKey = process.env.API_FOOTBALL_KEY
    console.log('[Test] API Key exists:', !!apiKey)
    
    // Test 2: Try to fetch players (just first page)
    console.log('[Test] Fetching players from API-Football...')
    const players = await getLeaguePlayers(39, 2024, 1) // Just 1 page for testing
    
    console.log('[Test] Players fetched:', players.length)
    if (players.length > 0) {
      console.log('[Test] First player:', JSON.stringify(players[0], null, 2).substring(0, 500))
    }
    
    return NextResponse.json({
      success: true,
      apiKeyExists: !!apiKey,
      playersFetched: players.length,
      firstPlayer: players[0] || null
    })
  } catch (error: any) {
    console.error('[Test] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

