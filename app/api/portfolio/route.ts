import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/portfolio
 * 
 * Returns the current user's portfolio
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || 'demo-user-id'
    
    const supabase = await createClient()
    
    // Get user's portfolio
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching portfolio:', error)
      return NextResponse.json(
        { error: 'Failed to fetch portfolio' },
        { status: 500 }
      )
    }
    
    // Get current player prices
    const playerIds = portfolio?.map(p => p.player_id) || []
    let players: any[] = []
    
    if (playerIds.length > 0) {
      const { data: playersData } = await supabase
        .from('players')
        .select('id, name, current_price')
        .in('id', playerIds)
      
      players = playersData || []
    }
    
    // Calculate total value
    let totalValue = 0
    const portfolioWithPrices = portfolio?.map(item => {
      const player = players.find(p => p.id === item.player_id)
      const value = (player?.current_price || 0) * item.quantity
      totalValue += value
      
      return {
        ...item,
        player_name: player?.name || 'Unknown',
        current_price: player?.current_price || 0,
        total_value: value
      }
    }) || []
    
    return NextResponse.json({
      success: true,
      portfolio: portfolioWithPrices,
      total_value: totalValue
    })
  } catch (error: any) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
