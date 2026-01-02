/**
 * Player Data Transformer
 * 
 * Transforms API-Football player data to our database format
 */

interface ApiFootballPlayer {
  player: {
    id: number
    name: string
    age: number
    position: string
    photo: string
  }
  statistics: Array<{
    team: {
      id: number
      name: string
    }
    games: {
      position: string
      rating: string
      minutes: number
    }
    goals: {
      total: number
      assists: number
    }
    cards: {
      yellow: number
      red: number
    }
  }>
}

/**
 * Map API-Football position to our position format
 */
function mapPosition(apiPosition: string): 'GK' | 'DEF' | 'MID' | 'FWD' {
  const pos = apiPosition?.toUpperCase() || ''
  
  if (pos.includes('GOALKEEPER') || pos === 'G') return 'GK'
  if (pos.includes('DEFENDER') || pos.includes('BACK')) return 'DEF'
  if (pos.includes('MIDFIELDER') || pos.includes('MID')) return 'MID'
  if (pos.includes('ATTACKER') || pos.includes('FORWARD') || pos.includes('WINGER')) return 'FWD'
  
  // Default based on common positions
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'DEF'
  if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(pos)) return 'MID'
  if (['ST', 'CF', 'LW', 'RW', 'LF', 'RF'].includes(pos)) return 'FWD'
  
  return 'MID' // Default fallback
}

/**
 * Calculate base price from player statistics
 */
function calculateBasePrice(player: ApiFootballPlayer): number {
  const stats = player.statistics?.[0]
  if (!stats) return 25.00 // Default price
  
  let price = 20.00 // Base price
  
  // Goals contribution
  if (stats.goals?.total) {
    price += stats.goals.total * 2.5
  }
  
  // Assists contribution
  if (stats.goals?.assists) {
    price += stats.goals.assists * 1.5
  }
  
  // Rating contribution (if available)
  if (stats.games?.rating) {
    const rating = parseFloat(stats.games.rating) || 6.0
    if (rating > 7.0) price += (rating - 7.0) * 5
  }
  
  // Age factor (younger = higher potential)
  const age = player.player.age || 25
  if (age < 23) price *= 1.2
  else if (age > 30) price *= 0.9
  
  // Position premium
  const position = mapPosition(stats.games?.position || player.player.position)
  const positionMultiplier = {
    'FWD': 1.3,
    'MID': 1.1,
    'DEF': 1.0,
    'GK': 0.9
  }[position] || 1.0
  
  price *= positionMultiplier
  
  // Ensure minimum and reasonable maximum
  return Math.max(10.00, Math.min(price, 100.00))
}

/**
 * Transform API-Football player to database format
 */
export function transformApiPlayerToDB(
  apiPlayer: ApiFootballPlayer,
  teamName?: string
): {
  name: string
  team: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  base_price: number
  current_price: number
  price_cap: number
  price_floor: number
  total_shares: number
  available_shares: number
} {
  const stats = apiPlayer.statistics?.[0]
  const position = mapPosition(stats?.games?.position || apiPlayer.player.position)
  const basePrice = calculateBasePrice(apiPlayer)
  
  return {
    name: apiPlayer.player.name,
    team: teamName || stats?.team?.name || 'Unknown',
    position: position,
    base_price: Math.round(basePrice * 100) / 100,
    current_price: Math.round(basePrice * 100) / 100,
    price_cap: Math.round(basePrice * 2 * 100) / 100,
    price_floor: Math.round(basePrice * 0.5 * 100) / 100,
    total_shares: 1000,
    available_shares: 1000
  }
}

/**
 * Get player statistics summary
 */
export function getPlayerStatsSummary(apiPlayer: ApiFootballPlayer) {
  const stats = apiPlayer.statistics?.[0]
  
  return {
    goals: stats?.goals?.total || 0,
    assists: stats?.goals?.assists || 0,
    yellowCards: stats?.cards?.yellow || 0,
    redCards: stats?.cards?.red || 0,
    minutes: stats?.games?.minutes || 0,
    rating: parseFloat(stats?.games?.rating || '0') || 0,
    position: stats?.games?.position || apiPlayer.player.position,
    team: stats?.team?.name || 'Unknown'
  }
}

