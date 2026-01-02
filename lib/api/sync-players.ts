/**
 * Sync Players from API-Football
 * 
 * Fetches live player data and updates Supabase database
 */

import { getLeaguePlayers, getPlayersByTeam, getTeamPlayers, getTeams } from './football-api'
import { transformApiPlayerToDB } from './player-transformer'
import { createClient } from '@/lib/supabase/server'

// Premier League Configuration
// League: England - Premier League
// Season: 2025 (Started 2025/08/15, ongoing)
// API-Football V3 ID: 39
// API-Football V2 ID: 7293
const EPL_LEAGUE_ID = 39
const CURRENT_SEASON = 2025

/**
 * Sync all EPL players from API-Football to Supabase
 * 
 * Strategy: Use getLeaguePlayers to fetch all players from the league at once
 * This is more efficient than fetching team by team
 */
export async function syncPlayersFromAPI() {
  try {
    console.log('[Sync] Starting player sync from API-Football...')
    console.log(`[Sync] League: ${EPL_LEAGUE_ID}, Season: ${CURRENT_SEASON}`)
    
    const supabase = await createClient()
    
    // Method 1: Try to get all league players at once (most efficient)
    console.log('[Sync] Attempting to fetch all league players...')
    let allApiPlayers: any[] = []
    
    try {
      // Fetch players from the league directly
      const leaguePlayers = await getLeaguePlayers(EPL_LEAGUE_ID, CURRENT_SEASON)
      console.log(`[Sync] Fetched ${leaguePlayers.length} players from league endpoint`)
      
      if (leaguePlayers && leaguePlayers.length > 0) {
        allApiPlayers = leaguePlayers
      }
    } catch (leagueError: any) {
      console.warn(`[Sync] League endpoint failed: ${leagueError.message}`)
      console.log('[Sync] Falling back to team-by-team method...')
      
      // Method 2: Fallback - get teams and fetch players per team
      try {
        const teams = await getTeams(EPL_LEAGUE_ID, CURRENT_SEASON)
        console.log(`[Sync] Found ${teams.length} teams`)
        
        for (let i = 0; i < teams.length; i++) { // Process all teams
          const team: any = teams[i]
          const teamId = team?.team?.id || team?.id
          const teamName = team?.team?.name || team?.name || 'Unknown'
          
          if (!teamId) continue
          
          try {
            console.log(`[Sync] Fetching players from team ${teamName} (${teamId})...`)
            let teamPlayers = await getPlayersByTeam(teamId, CURRENT_SEASON)
            
            if (!teamPlayers || teamPlayers.length === 0) {
              teamPlayers = await getTeamPlayers(teamId, CURRENT_SEASON)
            }
            
            if (teamPlayers && teamPlayers.length > 0) {
              console.log(`[Sync] Found ${teamPlayers.length} players from ${teamName}`)
              allApiPlayers.push(...teamPlayers)
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 7000))
          } catch (teamError: any) {
            console.error(`[Sync] Error fetching players for ${teamName}:`, teamError.message)
          }
        }
      } catch (teamsError: any) {
        console.error(`[Sync] Error fetching teams:`, teamsError.message)
      }
    }
    
    console.log(`[Sync] Total API players fetched: ${allApiPlayers.length}`)
    
    if (allApiPlayers.length === 0) {
      return {
        success: false,
        error: 'No players fetched from API-Football. Check API key and rate limits.',
        total: 0,
        successful: 0,
        errors: 0
      }
    }
    
    // Transform and upsert players
    const transformedPlayers: Array<ReturnType<typeof transformApiPlayerToDB>> = []
    
    for (const apiPlayer of allApiPlayers) {
      try {
        // Log first player structure for debugging
        if (transformedPlayers.length === 0) {
          console.log('[Sync] Sample API player structure:', JSON.stringify(apiPlayer, null, 2).substring(0, 500))
        }
        
        // Extract team name from player data
        const teamName = apiPlayer.statistics?.[0]?.team?.name || 
                        apiPlayer.team?.name || 
                        'Unknown'
        
        // Validate required fields
        if (!apiPlayer.player || !apiPlayer.player.name) {
          console.warn('[Sync] Skipping player with missing name:', apiPlayer)
          continue
        }
        
        const dbPlayer = transformApiPlayerToDB(apiPlayer, teamName)
        transformedPlayers.push(dbPlayer)
      } catch (transformError: any) {
        console.error(`[Sync] Error transforming player:`, transformError.message)
        console.error(`[Sync] Player data:`, JSON.stringify(apiPlayer, null, 2).substring(0, 300))
      }
    }
    
    console.log(`[Sync] Transformed ${transformedPlayers.length} players`)
    
    // Upsert players to database
    let successCount = 0
    let errorCount = 0
    
    // Upsert players one by one (since we don't have unique constraint on name)
    for (const player of transformedPlayers) {
      try {
        // Check if player exists
        const { data: existingData, error: selectError } = await supabase
          .from('players')
          .select('id')
          .eq('name', player.name)
          .maybeSingle()
        
        const existing = existingData && !selectError ? existingData : null
        
        if (existing) {
          // Update existing player
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
              available_shares: player.total_shares,
              updated_at: new Date().toISOString()
            })
            .eq('name', player.name)
          
          if (error) {
            console.error(`[Sync] Error updating ${player.name}:`, error.message)
            errorCount++
          } else {
            successCount++
          }
        } else {
          // Insert new player - add random variation to current price
          const variation = (Math.random() - 0.5) * 0.1 // -5% to +5%
          const variedPrice = player.base_price * (1 + variation)
          
          const { error } = await supabase
            .from('players')
            .insert({
              ...player,
              current_price: Math.round(variedPrice * 100) / 100,
              available_shares: player.total_shares
            })
          
          if (error) {
            console.error(`[Sync] Error inserting ${player.name}:`, error.message)
            errorCount++
          } else {
            successCount++
          }
        }
        
        // Log progress every 10 players
        if ((successCount + errorCount) % 10 === 0) {
          console.log(`[Sync] Progress: ${successCount + errorCount}/${transformedPlayers.length}`)
        }
      } catch (error: any) {
        console.error(`[Sync] Error processing ${player.name}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`[Sync] Complete: ${successCount} successful, ${errorCount} errors`)
    
    return {
      success: successCount > 0,
      total: transformedPlayers.length,
      successful: successCount,
      errors: errorCount
    }
  } catch (error: any) {
    console.error('[Sync] Fatal error:', error)
    return {
      success: false,
      error: error.message || 'Unknown sync error',
      total: 0,
      successful: 0,
      errors: 0
    }
  }
}

