import { NextResponse } from 'next/server'
import { getLeagues } from '@/lib/api/football-api'

export const dynamic = 'force-dynamic'

/**
 * GET /api/leagues
 * 
 * Returns all leagues from API-Football
 */
export async function GET() {
  try {
    const leagues = await getLeagues()
    
    return NextResponse.json({
      success: true,
      data: leagues,
      count: leagues.length
    })
  } catch (error: any) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leagues',
        message: error.message
      },
      { status: 500 }
    )
  }
}
