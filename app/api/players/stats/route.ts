import { NextResponse } from 'next/server'
import { getPlayerStats, getTeamPlayerStats } from '@/lib/api/football-api'
import { getPlayerStatsSummary } from '@/lib/api/player-transformer'

export const dynamic = 'force-dynamic'

/**
 * GET /api/players/stats
 * 
 * Returns player statistics from API-Football
 * 
 * Query params:
 * - player: number (player ID)
 * - team: number (team ID) - returns all team players
 * - season: number (default: 2024)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('player')
    const teamId = searchParams.get('team')
    const season = parseInt(searchParams.get('season') || '2024')
    
    if (playerId) {
      // Get specific player stats
      const stats = await getPlayerStats(parseInt(playerId), season)
      const summaries = stats.map((stat: any) => getPlayerStatsSummary(stat))
      
      return NextResponse.json({
        success: true,
        data: summaries,
        playerId: parseInt(playerId)
      })
    } else if (teamId) {
      // Get all team player stats
      const stats = await getTeamPlayerStats(parseInt(teamId), season)
      const summaries = stats.map((stat: any) => getPlayerStatsSummary(stat))
      
      return NextResponse.json({
        success: true,
        data: summaries,
        teamId: parseInt(teamId),
        count: summaries.length
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either player or team parameter is required'
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error fetching player stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch player statistics',
        message: error.message
      },
      { status: 500 }
    )
  }
}
