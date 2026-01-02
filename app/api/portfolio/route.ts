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
    
    // If no portfolio exists, generate demo data with 30 random players
    if (!portfolio || portfolio.length === 0) {
      // Get all players for demo data generation
      const { data: allPlayersData } = await supabase
        .from('players')
        .select('*')
        .limit(100)
      
      if (!allPlayersData || allPlayersData.length === 0) {
        return NextResponse.json({
          success: true,
          portfolio: [],
          total_value: 0,
          virtual_balance: 10000
        })
      }
      
      // Shuffle and pick 30 random players
      const shuffled = [...allPlayersData].sort(() => 0.5 - Math.random())
      const selectedPlayers = shuffled.slice(0, 30)
      
      // Generate holdings totaling approximately 6000 R Bucks
      const targetTotal = 6000
      const totalShares = selectedPlayers.reduce((sum, p) => sum + Math.random() * 50 + 10, 0)
      const scaleFactor = targetTotal / (selectedPlayers.reduce((sum, p) => sum + (p.current_price || p.base_price || 25) * (Math.random() * 50 + 10), 0))
      
      const demoPortfolio = selectedPlayers.map((player, index) => {
        const baseShares = Math.random() * 50 + 10
        const shares = Math.floor(baseShares * scaleFactor * (0.8 + Math.random() * 0.4)) // Add some variation
        const currentPrice = player.current_price || player.base_price || 25
        const basePrice = player.base_price || 25
        const totalValue = currentPrice * shares
        
        // Calculate price change
        const priceChange = currentPrice - basePrice
        const priceChangePercent = (priceChange / basePrice) * 100
        
        // Calculate value change (assuming base price was buy price)
        const valueChange = totalValue - (basePrice * shares)
        const valueChangePercent = (valueChange / (basePrice * shares)) * 100
        
        return {
          id: `demo-${index}`,
          player_id: player.id,
          user_id: userId,
          shares: shares,
          player: player,
          player_name: player.name,
          base_price: basePrice,
          current_price: currentPrice,
          total_value: totalValue,
          price_change: priceChange,
          price_change_percent: priceChangePercent,
          value_change: valueChange,
          value_change_percent: valueChangePercent
        }
      })
      
      // Recalculate to ensure total is close to 6000
      const actualTotal = demoPortfolio.reduce((sum, item) => sum + item.total_value, 0)
      const finalScale = targetTotal / actualTotal
      
      const finalPortfolio = demoPortfolio.map(item => ({
        ...item,
        shares: Math.floor(item.shares * finalScale),
        total_value: item.current_price * Math.floor(item.shares * finalScale),
        value_change: (item.current_price * Math.floor(item.shares * finalScale)) - (item.base_price * Math.floor(item.shares * finalScale)),
        value_change_percent: ((item.current_price - item.base_price) / item.base_price) * 100
      }))
      
      const finalTotal = finalPortfolio.reduce((sum, item) => sum + item.total_value, 0)
      
      return NextResponse.json({
        success: true,
        portfolio: finalPortfolio,
        total_value: finalTotal,
        virtual_balance: 10000
      })
    }
    
    // Get current player prices for existing portfolio
    const playerIds = portfolio?.map(p => p.player_id) || []
    let players: any[] = []
    
    if (playerIds.length > 0) {
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .in('id', playerIds)
      
      players = playersData || []
    }
    
    // Calculate total value for real portfolio
    let totalValue = 0
    const portfolioWithPrices = portfolio.map(item => {
      const player = players.find(p => p.id === item.player_id)
      const shares = item.shares || item.quantity || 0
      const currentPrice = player?.current_price || 0
      const basePrice = player?.base_price || currentPrice
      const value = currentPrice * shares
      totalValue += value
      
      // Calculate changes
      const priceChange = currentPrice - basePrice
      const priceChangePercent = basePrice > 0 ? (priceChange / basePrice) * 100 : 0
      const avgBuyPrice = item.average_buy_price || basePrice
      const valueChange = value - (avgBuyPrice * shares)
      const valueChangePercent = (avgBuyPrice * shares) > 0 ? (valueChange / (avgBuyPrice * shares)) * 100 : 0
      
      return {
        ...item,
        player: player || null,
        player_name: player?.name || 'Unknown',
        base_price: basePrice,
        current_price: currentPrice,
        shares: shares,
        total_value: value,
        price_change: priceChange,
        price_change_percent: priceChangePercent,
        value_change: valueChange,
        value_change_percent: valueChangePercent
      }
    })
    
    // Get user balance
    const { data: user } = await supabase
      .from('users')
      .select('virtual_balance')
      .eq('id', userId)
      .single()
    
    return NextResponse.json({
      success: true,
      portfolio: portfolioWithPrices,
      total_value: totalValue,
      virtual_balance: user?.virtual_balance || 10000
    })
  } catch (error: any) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
