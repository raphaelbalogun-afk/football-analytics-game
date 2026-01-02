/**
 * Test script to sync Premier League 2025 data
 * 
 * Run with: npx tsx scripts/test-sync-2025.ts
 */

import { syncPlayersFromAPI } from '../lib/api/sync-players'

async function main() {
  console.log('Starting sync for Premier League 2025...')
  console.log('League ID: 39')
  console.log('Season: 2025')
  console.log('---')
  
  try {
    const result = await syncPlayersFromAPI()
    
    console.log('\n=== Sync Results ===')
    console.log('Success:', result.success)
    console.log('Total players processed:', result.total)
    console.log('Successfully synced:', result.successful)
    console.log('Errors:', result.errors)
    
    if (result.error) {
      console.log('Error message:', result.error)
    }
    
    if (result.success) {
      console.log('\n✅ Sync completed successfully!')
    } else {
      console.log('\n❌ Sync failed')
      process.exit(1)
    }
  } catch (error: any) {
    console.error('Fatal error:', error)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

main()

