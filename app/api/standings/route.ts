import { NextResponse } from 'next/server'
import { getStandings } from '@/lib/api/football-api'

/**
 * GET /api/standings
 * 
 * Returns league standings/table from API-Football
 * 
 * Query params:
 * - league: number (default: 39 for EPL)
 * - season: number (default: 2024)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const league = parseInt(searchParams.get('league') || '39')
    const season = parseInt(searchParams.get('season') || '2024')
    
    const standings = await getStandings(league, season)
    
    return NextResponse.json({
      success: true,
      data: standings,
      league,
      season
    })
  } catch (error: any) {
    console.error('Error fetching standings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch standings',
        message: error.message
      },
      { status: 500 }
    )
  }
}

