import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/leaderboard
 * 
 * Returns leaderboard ranked by total portfolio value
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, virtual_balance')
    
    if (usersError) throw usersError
    
    // Calculate total value for each user (balance + portfolio value)
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const { data: portfolio } = await supabase
          .from('portfolios')
          .select(`
            shares,
            players (
              current_price
            )
          `)
          .eq('user_id', user.id)
        
        let portfolioValue = 0
        if (portfolio) {
          portfolioValue = portfolio.reduce((sum: number, item: any) => {
            return sum + (item.shares * item.players.current_price)
          }, 0)
        }
        
        return {
          user_id: user.id,
          email: user.email,
          virtual_balance: user.virtual_balance,
          portfolio_value: portfolioValue,
          total_value: user.virtual_balance + portfolioValue,
          holdings_count: portfolio?.length || 0
        }
      })
    )
    
    // Sort by total value descending
    leaderboard.sort((a, b) => b.total_value - a.total_value)
    
    // Add ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }))
    
    return NextResponse.json({
      success: true,
      data: rankedLeaderboard
    })
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch leaderboard',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
