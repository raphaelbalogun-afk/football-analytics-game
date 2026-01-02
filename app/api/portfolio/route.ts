import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/portfolio
 * 
 * Returns user's portfolio with current values and P&L
 * 
 * Query parameters:
 * - user_id: string (UUID, required)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'user_id query parameter is required' 
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get user data for balance
    const { data: user } = await supabase
      .from('users')
      .select('virtual_balance, total_value')
      .eq('id', user_id)
      .single()
    
    // Get portfolio with player details
    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        players (
          id,
          name,
          team,
          position,
          current_price
        )
      `)
      .eq('user_id', user_id)
    
    if (error) throw error
    
    // Calculate portfolio metrics
    const portfolioEntries = (portfolio || []).map((item: any) => {
      const currentValue = item.shares * item.players.current_price
      const costBasis = item.shares * item.average_buy_price
      const pnl = currentValue - costBasis
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0
      
      return {
        id: item.id,
        player: {
          id: item.players.id,
          name: item.players.name,
          team: item.players.team,
          position: item.players.position,
          currentPrice: item.players.current_price
        },
        shares: item.shares,
        averageBuyPrice: item.average_buy_price,
        currentValue: Math.round(currentValue * 100) / 100,
        costBasis: Math.round(costBasis * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: Math.round(pnlPercent * 100) / 100
      }
    })
    
    // Calculate summary
    const totalValue = portfolioEntries.reduce((sum, entry) => sum + entry.currentValue, 0)
    const totalCostBasis = portfolioEntries.reduce((sum, entry) => sum + entry.costBasis, 0)
    const totalPnL = totalValue - totalCostBasis
    const totalPnLPercent = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0
    
    return NextResponse.json({
      success: true,
      data: portfolioEntries,
      summary: {
        virtualBalance: user?.virtual_balance || 0,
        totalValue: user?.total_value || 0,
        totalHoldings: portfolioEntries.length,
        portfolioValue: Math.round(totalValue * 100) / 100,
        totalCostBasis: Math.round(totalCostBasis * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        totalPnLPercent: Math.round(totalPnLPercent * 100) / 100
      }
    })
  } catch (error: any) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch portfolio',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

