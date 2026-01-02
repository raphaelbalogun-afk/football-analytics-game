/**
 * Sync All Data from API-Football
 * 
 * This script syncs all data from API-Football:
 * - Players
 * - Leagues
 * - Standings
 * - Statistics
 * 
 * Run with: npx tsx scripts/sync-all-data.ts
 */

import { syncPlayersFromAPI } from '@/lib/api/sync-players'

async function main() {
  console.log('🚀 Starting full data sync from API-Football...\n')
  
  // Sync players
  console.log('📊 Syncing players...')
  const playerResult = await syncPlayersFromAPI()
  
  if (playerResult.success) {
    console.log(`✅ Players synced: ${playerResult.successful}/${playerResult.total}`)
  } else {
    console.error(`❌ Player sync failed: ${playerResult.error}`)
  }
  
  console.log('\n✨ Sync complete!')
  console.log('\nNext steps:')
  console.log('1. Check Supabase database for updated players')
  console.log('2. Visit http://localhost:3000/market to see players')
  console.log('3. Use /api/standings for league table')
  console.log('4. Use /api/players/stats for player statistics')
}

main().catch(console.error)

