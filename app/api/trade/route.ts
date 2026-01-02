import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateBuyPrice, calculateSellPrice, calculateTotalCost } from '@/lib/pricing'

/**
 * POST /api/trade
 * 
 * Execute a buy or sell trade for a player
 * 
 * Request body:
 * {
 *   user_id: string (UUID)
 *   player_id: string (UUID)
 *   type: 'buy' | 'sell'
 *   shares: number (positive integer)
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { user_id, player_id, type, shares } = body
    
    // Validation
    if (!user_id || !player_id || !type || !shares || shares <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: user_id, player_id, type, shares' 
        },
        { status: 400 }
      )
    }
    
    if (type !== 'buy' && type !== 'sell') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid trade type. Must be "buy" or "sell"' 
        },
        { status: 400 }
      )
    }
    
    // Get player data
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .single()
    
    if (playerError || !player) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Player not found' 
        },
        { status: 404 }
      )
    }
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single()
    
    if (userError || !user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Get user portfolio for this player
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user_id)
      .eq('player_id', player_id)
      .maybeSingle()
    
    if (type === 'buy') {
      // Check available shares
      if (shares > player.available_shares) {
        return NextResponse.json(
          { 
            success: false,
            error: `Not enough shares available. Available: ${player.available_shares}, Requested: ${shares}` 
          },
          { status: 400 }
        )
      }
      
      // Calculate new price
      const priceUpdate = calculateBuyPrice(
        player.current_price,
        shares,
        player.total_shares,
        player.price_cap
      )
      
      const totalCost = calculateTotalCost(shares, priceUpdate.newPrice)
      
      // Check user balance (prevent negative balance)
      if (user.virtual_balance < totalCost) {
        return NextResponse.json(
          { 
            success: false,
            error: `Insufficient balance. Required: £${totalCost.toFixed(2)}, Available: £${user.virtual_balance.toFixed(2)}` 
          },
          { status: 400 }
        )
      }
      
      // Execute trade
      const { error: tradeError } = await supabase
        .from('trades')
        .insert({
          user_id,
          player_id,
          type: 'buy',
          shares,
          price_per_share: priceUpdate.newPrice,
          total_amount: totalCost
        })
      
      if (tradeError) throw tradeError
      
      // Update player price and available shares
      const { error: playerUpdateError } = await supabase
        .from('players')
        .update({
          current_price: priceUpdate.newPrice,
          available_shares: player.available_shares - shares
        })
        .eq('id', player_id)
      
      if (playerUpdateError) throw playerUpdateError
      
      // Update user balance
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          virtual_balance: user.virtual_balance - totalCost
        })
        .eq('id', user_id)
      
      if (userUpdateError) throw userUpdateError
      
      // Update or create portfolio entry
      if (portfolio) {
        const newAveragePrice = (
          (portfolio.average_buy_price * portfolio.shares + priceUpdate.newPrice * shares) /
          (portfolio.shares + shares)
        )
        
        const { error: portfolioUpdateError } = await supabase
          .from('portfolios')
          .update({
            shares: portfolio.shares + shares,
            average_buy_price: newAveragePrice
          })
          .eq('id', portfolio.id)
        
        if (portfolioUpdateError) throw portfolioUpdateError
      } else {
        const { error: portfolioInsertError } = await supabase
          .from('portfolios')
          .insert({
            user_id,
            player_id,
            shares,
            average_buy_price: priceUpdate.newPrice
          })
        
        if (portfolioInsertError) throw portfolioInsertError
      }
      
      return NextResponse.json({
        success: true,
        newPrice: priceUpdate.newPrice,
        totalCost,
        updatedBalance: user.virtual_balance - totalCost
      })
    } else if (type === 'sell') {
      // Check user has enough shares
      if (!portfolio || portfolio.shares < shares) {
        return NextResponse.json(
          { 
            success: false,
            error: `Not enough shares to sell. Owned: ${portfolio?.shares || 0}, Requested: ${shares}` 
          },
          { status: 400 }
        )
      }
      
      // Calculate new price
      const priceUpdate = calculateSellPrice(
        player.current_price,
        shares,
        player.total_shares,
        player.price_floor
      )
      
      const totalRevenue = calculateTotalCost(shares, priceUpdate.newPrice)
      
      // Execute trade
      const { error: tradeError } = await supabase
        .from('trades')
        .insert({
          user_id,
          player_id,
          type: 'sell',
          shares,
          price_per_share: priceUpdate.newPrice,
          total_amount: totalRevenue
        })
      
      if (tradeError) throw tradeError
      
      // Update player price and available shares
      const { error: playerUpdateError } = await supabase
        .from('players')
        .update({
          current_price: priceUpdate.newPrice,
          available_shares: player.available_shares + shares
        })
        .eq('id', player_id)
      
      if (playerUpdateError) throw playerUpdateError
      
      // Update user balance
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          virtual_balance: user.virtual_balance + totalRevenue
        })
        .eq('id', user_id)
      
      if (userUpdateError) throw userUpdateError
      
      // Update portfolio
      if (portfolio.shares === shares) {
        // Remove portfolio entry if selling all shares
        const { error: portfolioDeleteError } = await supabase
          .from('portfolios')
          .delete()
          .eq('id', portfolio.id)
        
        if (portfolioDeleteError) throw portfolioDeleteError
      } else {
        const { error: portfolioUpdateError } = await supabase
          .from('portfolios')
          .update({
            shares: portfolio.shares - shares
          })
          .eq('id', portfolio.id)
        
        if (portfolioUpdateError) throw portfolioUpdateError
      }
      
      return NextResponse.json({
        success: true,
        newPrice: priceUpdate.newPrice,
        totalRevenue,
        updatedBalance: user.virtual_balance + totalRevenue
      })
    }
  } catch (error: any) {
    console.error('Trade error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to execute trade',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

