/**
 * API-Football Service
 * 
 * Fetches live data from API-Football (v3)
 * Documentation: https://www.api-football.com/documentation-v3
 */

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'
const API_KEY = process.env.API_FOOTBALL_KEY || '50fffba51340e0b4987bba113fc2d0e9'

interface ApiFootballResponse<T> {
  get: string
  parameters: Record<string, any>
  errors: any[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: T[]
}

/**
 * Make request to API-Football
 */
async function apiRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T[]> {
  const url = new URL(`${API_FOOTBALL_BASE_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  console.log(`[API-Football] Requesting: ${endpoint}`, params)

  const response = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    },
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[API-Football] Error ${response.status}:`, errorText)
    throw new Error(`API-Football error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  // Log response structure for debugging
  console.log(`[API-Football] Response structure:`, {
    hasResponse: !!data.response,
    isArray: Array.isArray(data),
    results: data.results,
    errors: data.errors
  })
  
  if (data.errors && data.errors.length > 0) {
    console.error('API-Football errors:', data.errors)
    throw new Error(`API-Football errors: ${JSON.stringify(data.errors)}`)
  }

  // Handle different response formats
  if (Array.isArray(data)) {
    return data
  }
  
  if (data.response && Array.isArray(data.response)) {
    return data.response
  }
  
  if (data.results === 0) {
    console.warn(`[API-Football] No results for ${endpoint}`)
    return []
  }

  console.warn(`[API-Football] Unexpected response format for ${endpoint}`)
  return []
}

/**
 * Get all leagues (EPL focus)
 */
export async function getLeagues() {
  return apiRequest('/leagues', { country: 'England' })
}

/**
 * Get EPL standings/table
 */
export async function getStandings(league: number = 39, season: number = 2024) {
  return apiRequest('/standings', { league, season })
}

/**
 * Get all teams in a league
 */
export async function getTeams(league: number = 39, season: number = 2024) {
  return apiRequest('/teams', { league, season })
}

/**
 * Get players from a team (squad)
 */
export async function getTeamPlayers(team: number, season: number = 2024) {
  return apiRequest('/players/squads', { team })
}

/**
 * Get players by team (alternative endpoint)
 */
export async function getPlayersByTeam(team: number, season: number = 2024) {
  return apiRequest('/players', { team, season })
}

/**
 * Get all players in a league (with pagination)
 */
export async function getLeaguePlayers(league: number = 39, season: number = 2024, maxPages: number = 10) {
  const allPlayers: any[] = []
  
  for (let page = 1; page <= maxPages; page++) {
    try {
      const players = await apiRequest('/players', { league, season, page })
      if (players && players.length > 0) {
        allPlayers.push(...players)
        console.log(`[API] Fetched page ${page}: ${players.length} players`)
        
        // If we got less than expected, we might be at the last page
        if (players.length < 20) {
          break
        }
      } else {
        break
      }
      
      // Rate limiting - wait between pages
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error: any) {
      console.error(`[API] Error fetching page ${page}:`, error.message)
      break
    }
  }
  
  return allPlayers
}

/**
 * Get player statistics
 */
export async function getPlayerStats(player: number, season: number = 2024) {
  return apiRequest('/players', { id: player, season })
}

/**
 * Get player statistics by team
 */
export async function getTeamPlayerStats(team: number, season: number = 2024) {
  return apiRequest('/players', { team, season })
}

/**
 * Get fixtures (matches)
 */
export async function getFixtures(league: number = 39, season: number = 2024) {
  return apiRequest('/fixtures', { league, season })
}

/**
 * Get player information
 */
export async function getPlayerInfo(player: number) {
  return apiRequest('/players', { id: player })
}

