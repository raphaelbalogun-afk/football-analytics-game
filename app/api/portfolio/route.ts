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
        .limit(200) // Get more players to have better selection
      
      if (!allPlayersData || allPlayersData.length === 0) {
        return NextResponse.json({
          success: true,
          portfolio: [],
          total_value: 0,
          virtual_balance: 10000
        })
      }
      
      // Shuffle and pick 30 random players using deterministic method (no Math.random)
      const shuffled = [...allPlayersData]
      // Fisher-Yates shuffle with seed based on userId for consistency
      for (let i = shuffled.length - 1; i > 0; i--) {
        const seed = ((userId.charCodeAt(0) || 0) + i * 7919) % shuffled.length
        const j = seed
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      const selectedPlayers = shuffled.slice(0, Math.min(30, shuffled.length))
      
      // Generate holdings totaling approximately 6000 R Bucks
      const targetTotal = 6000
      
      // First pass: calculate shares for each player
      const demoPortfolio = selectedPlayers.map((player, index) => {
        // Use deterministic calculation based on player ID and index (no Math.random)
        const seed = ((player.id?.charCodeAt(0) || 0) + index * 7919) % 10000
        const randomFactor = ((seed * 9301 + 49297) % 233280) / 233280 // Simple PRNG
        
        // Calculate shares based on player price to distribute evenly
        const currentPrice = player.current_price || player.base_price || 25
        const basePrice = player.base_price || 25
        
        // Target value per player (6000 / 30 = 200 per player on average)
        // Add variation: 0.5x to 1.5x the average
        const targetValuePerPlayer = targetTotal / selectedPlayers.length
        const variation = 0.5 + randomFactor * 1.0 // 0.5 to 1.5
        const targetValue = targetValuePerPlayer * variation
        
        const shares = Math.max(1, Math.floor(targetValue / currentPrice))
        
        // Calculate price change (some players up, some down) - deterministic
        // 60% positive, 40% negative
        const isPositive = (seed % 10) < 6
        const priceVariationPercent = isPositive
          ? ((seed % 50) / 10) // 0% to +5%
          : -((seed % 50) / 10) // -5% to 0%
        
        const priceChange = basePrice * (priceVariationPercent / 100)
        const adjustedCurrentPrice = Math.max(1, basePrice + priceChange)
        const actualTotalValue = adjustedCurrentPrice * shares
        const priceChangePercent = (basePrice > 0) ? (priceChange / basePrice) * 100 : 0

        // Calculate value change (assuming base price was buy price)
        const valueChange = actualTotalValue - (basePrice * shares)
        const valueChangePercent = (basePrice * shares > 0) ? (valueChange / (basePrice * shares)) * 100 : 0

        return {
          id: `demo-${player.id}-${index}`,
          player_id: player.id,
          user_id: userId,
          shares: shares,
          player: {
            ...player,
            current_price: adjustedCurrentPrice
          },
          player_name: player.name,
          base_price: basePrice,
          current_price: adjustedCurrentPrice,
          total_value: actualTotalValue,
          price_change: priceChange,
          price_change_percent: priceChangePercent,
          value_change: valueChange,
          value_change_percent: valueChangePercent
        }
      })

      // Recalculate to ensure total is close to 6000
      const actualTotal = demoPortfolio.reduce((sum, item) => sum + item.total_value, 0)
      const finalScale = targetTotal / actualTotal

      const finalPortfolio = demoPortfolio.map(item => {
        const adjustedShares = Math.max(1, Math.floor(item.shares * finalScale))
        const adjustedTotalValue = item.current_price * adjustedShares
        const adjustedValueChange = adjustedTotalValue - (item.base_price * adjustedShares)
        const adjustedValueChangePercent = (item.base_price * adjustedShares > 0) 
          ? (adjustedValueChange / (item.base_price * adjustedShares)) * 100 
          : 0

        return {
          ...item,
          shares: adjustedShares,
          total_value: Math.round(adjustedTotalValue * 100) / 100,
          value_change: Math.round(adjustedValueChange * 100) / 100,
          value_change_percent: Math.round(adjustedValueChangePercent * 100) / 100
        }
      })

      const finalTotal = finalPortfolio.reduce((sum, item) => sum + item.total_value, 0)
      
      return NextResponse.json({
        success: true,
        portfolio: finalPortfolio,
        total_value: Math.round(finalTotal * 100) / 100, // Round to 2 decimal places
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
