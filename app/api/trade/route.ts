import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateBuyPrice, calculateSellPrice, calculateTotalCost } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

/**
 * POST /api/trade
 * 
 * Handles buy/sell trades for player shares
 * 
 * Body:
 * - user_id: string
 * - player_id: string (UUID)
 * - action: 'buy' | 'sell'
 * - quantity: number
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, player_id, type, shares } = body
    
    // Support both 'action'/'quantity' and 'type'/'shares' for backward compatibility
    const action = type || body.action
    const quantity = shares || body.quantity
    
    // Validate input
    if (!user_id || !player_id || !action || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (action !== 'buy' && action !== 'sell') {
      return NextResponse.json(
        { error: 'Action must be "buy" or "sell"' },
        { status: 400 }
      )
    }
    
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { error: 'Quantity must be a positive integer' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get player data
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .single()
    
    if (playerError || !player) {
      return NextResponse.json(
        { error: 'Player not found' },
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
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Calculate price and cost
    // Pricing functions expect: (currentPrice, shares, totalShares, priceCap/Floor)
    const priceUpdate = action === 'buy' 
      ? calculateBuyPrice(player.current_price, quantity, player.total_shares, player.price_cap)
      : calculateSellPrice(player.current_price, quantity, player.total_shares, player.price_floor)
    
    const price = priceUpdate.newPrice
    const totalCost = calculateTotalCost(quantity, price)
    
    // Validate trade
    if (action === 'buy') {
      // Check balance
      if (user.virtual_balance < totalCost) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        )
      }
      
      // Check available shares
      if (player.available_shares < quantity) {
        return NextResponse.json(
          { error: 'Insufficient shares available' },
          { status: 400 }
        )
      }
    } else {
      // Check user has enough shares
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('quantity')
        .eq('user_id', user_id)
        .eq('player_id', player_id)
        .single()
      
      if (!portfolio || portfolio.quantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient shares in portfolio' },
          { status: 400 }
        )
      }
    }
    
    // Execute trade in transaction
    const { error: tradeError } = await supabase.rpc('execute_trade', {
      p_user_id: user_id,
      p_player_id: player_id,
      p_action: action,
      p_quantity: quantity,
      p_price: priceUpdate.newPrice,
      p_total_cost: totalCost
    })
    
    if (tradeError) {
      // Fallback to manual transaction if RPC doesn't exist
      console.warn('RPC execute_trade not found, using manual transaction')
      
      // Update user balance
      const newBalance = action === 'buy'
        ? user.virtual_balance - totalCost
        : user.virtual_balance + totalCost
      
      const { error: balanceError } = await supabase
        .from('users')
        .update({ virtual_balance: newBalance })
        .eq('id', user_id)
      
      if (balanceError) throw balanceError
      
      // Update player shares
      const newAvailableShares = action === 'buy'
        ? player.available_shares - quantity
        : player.available_shares + quantity
      
      const { error: sharesError } = await supabase
        .from('players')
        .update({ 
          available_shares: newAvailableShares,
          current_price: priceUpdate.newPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', player_id)
      
      if (sharesError) throw sharesError
      
      // Update portfolio
      const { data: existingPortfolio } = await supabase
        .from('portfolios')
        .select('shares')
        .eq('user_id', user_id)
        .eq('player_id', player_id)
        .single()
      
      if (existingPortfolio) {
        const newQuantity = action === 'buy'
          ? existingPortfolio.shares + quantity
          : existingPortfolio.shares - quantity
        
        if (newQuantity > 0) {
          await supabase
            .from('portfolios')
            .update({ shares: newQuantity })
            .eq('user_id', user_id)
            .eq('player_id', player_id)
        } else {
          await supabase
            .from('portfolios')
            .delete()
            .eq('user_id', user_id)
            .eq('player_id', player_id)
        }
      } else if (action === 'buy') {
        await supabase
          .from('portfolios')
          .insert({
            user_id,
            player_id,
            shares: quantity,
            average_buy_price: price
          })
      }
      
      // Record trade
      await supabase
        .from('trades')
        .insert({
          user_id,
          player_id,
          type: action,
          shares: quantity,
          price_per_share: price,
          total_amount: totalCost
        })
    }
    
    // Get updated player data
    const { data: updatedPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .single()
    
    // Get updated user data
    const { data: updatedUser } = await supabase
      .from('users')
      .select('virtual_balance')
      .eq('id', user_id)
      .single()
    
    return NextResponse.json({
      success: true,
      message: `${action === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${player.name}`,
      player: updatedPlayer,
      new_balance: updatedUser?.virtual_balance || user.virtual_balance,
      trade: {
        action,
        quantity,
        price,
        total_cost: totalCost
      }
    })
  } catch (error: any) {
    console.error('Trade error:', error)
    return NextResponse.json(
      { 
        error: 'Trade failed',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
