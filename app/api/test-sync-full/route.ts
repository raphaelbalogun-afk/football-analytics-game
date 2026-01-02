import { NextResponse } from 'next/server'
import { getLeaguePlayers } from '@/lib/api/football-api'
import { transformApiPlayerToDB } from '@/lib/api/player-transformer'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/test-sync-full
 * 
 * Test full sync process step by step
 */
export async function GET() {
  const results: any = {
    step1_api: { success: false, message: '' },
    step2_transform: { success: false, message: '', count: 0 },
    step3_database: { success: false, message: '', count: 0 }
  }
  
  try {
    // Step 1: Fetch from API
    console.log('[Test Full] Step 1: Fetching from API...')
    const players = await getLeaguePlayers(39, 2024, 1)
    results.step1_api = { success: true, message: `Fetched ${players.length} players`, count: players.length }
    console.log('[Test Full] Step 1: Success')
    
    if (players.length === 0) {
      return NextResponse.json({ success: false, results, error: 'No players fetched' })
    }
    
    // Step 2: Transform
    console.log('[Test Full] Step 2: Transforming players...')
    const transformed: any[] = []
    for (const player of players.slice(0, 5)) { // Just test first 5
      try {
        const teamName = player.statistics?.[0]?.team?.name || 'Unknown'
        const dbPlayer = transformApiPlayerToDB(player, teamName)
        transformed.push(dbPlayer)
      } catch (error: any) {
        console.error('[Test Full] Transform error:', error.message)
        results.step2_transform.message += `Error: ${error.message}; `
      }
    }
    results.step2_transform = { success: transformed.length > 0, message: `Transformed ${transformed.length} players`, count: transformed.length }
    console.log('[Test Full] Step 2: Success')
    
    // Step 3: Database upsert
    console.log('[Test Full] Step 3: Testing database upsert...')
    const supabase = await createClient()
    
    let dbSuccess = 0
    let dbErrors: string[] = []
    for (const player of transformed) {
      try {
        // First try to find existing player
        const { data: existingData, error: selectError } = await supabase
          .from('players')
          .select('id')
          .eq('name', player.name)
          .maybeSingle()
        
        const existing = existingData && !selectError ? existingData : null
        
        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('players')
            .update({
              team: player.team,
              position: player.position,
              base_price: player.base_price,
              current_price: player.base_price,
              price_cap: player.price_cap,
              price_floor: player.price_floor,
              total_shares: player.total_shares,
              available_shares: player.total_shares
            })
            .eq('name', player.name)
          
          if (error) {
            const errorMsg = `${player.name}: ${error.message || JSON.stringify(error)}`
            dbErrors.push(errorMsg)
            console.error('[Test Full] Update error:', error)
            console.error('[Test Full] Player data:', JSON.stringify(player, null, 2))
          } else {
            dbSuccess++
            console.log(`[Test Full] Updated ${player.name}`)
          }
        } else {
          // Insert new
          const { error, data } = await supabase
            .from('players')
            .insert({
              ...player,
              current_price: player.base_price,
              available_shares: player.total_shares
            })
            .select()
          
          if (error) {
            const errorMsg = `${player.name}: ${error.message || JSON.stringify(error)}`
            dbErrors.push(errorMsg)
            console.error('[Test Full] Insert error:', error)
            console.error('[Test Full] Player data:', JSON.stringify(player, null, 2))
          } else {
            dbSuccess++
            console.log(`[Test Full] Inserted ${player.name}`, data)
          }
        }
      } catch (error: any) {
        dbErrors.push(`Exception: ${error.message}`)
        console.error('[Test Full] DB exception:', error)
      }
    }
    
    if (dbErrors.length > 0) {
      results.step3_database.message += `Errors: ${dbErrors.join('; ')}`
    }
    
    results.step3_database = { 
      success: dbSuccess > 0, 
      message: `Upserted ${dbSuccess} of ${transformed.length} players`, 
      count: dbSuccess 
    }
    console.log('[Test Full] Step 3: Complete')
    
    return NextResponse.json({
      success: true,
      results
    })
  } catch (error: any) {
    console.error('[Test Full] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        results,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

