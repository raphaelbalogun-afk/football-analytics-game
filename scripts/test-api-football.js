/**
 * Test API-Football connection directly
 */

const API_KEY = '50fffba51340e0b4987bba113fc2d0e9'
const BASE_URL = 'https://v3.football.api-sports.io'

async function testAPI() {
  console.log('Testing API-Football connection...\n')
  
  // Test 1: Get leagues
  try {
    console.log('1. Testing /leagues endpoint...')
    const leaguesRes = await fetch(`${BASE_URL}/leagues?country=England`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    })
    const leaguesData = await leaguesRes.json()
    console.log('   Status:', leaguesRes.status)
    console.log('   Results:', leaguesData.results)
    console.log('   Errors:', leaguesData.errors || 'None')
    if (leaguesData.response && leaguesData.response.length > 0) {
      console.log('   Sample league:', leaguesData.response[0].league?.name)
    }
  } catch (error) {
    console.error('   Error:', error.message)
  }
  
  console.log('\n')
  
  // Test 2: Get players from league
  try {
    console.log('2. Testing /players endpoint (league=39, season=2024)...')
    const playersRes = await fetch(`${BASE_URL}/players?league=39&season=2024&page=1`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    })
    const playersData = await playersRes.json()
    console.log('   Status:', playersRes.status)
    console.log('   Results:', playersData.results)
    console.log('   Errors:', playersData.errors || 'None')
    if (playersData.response && playersData.response.length > 0) {
      console.log('   Sample player:', playersData.response[0].player?.name)
      console.log('   Total players in response:', playersData.response.length)
    }
  } catch (error) {
    console.error('   Error:', error.message)
  }
  
  console.log('\n')
  
  // Test 3: Get teams
  try {
    console.log('3. Testing /teams endpoint (league=39, season=2024)...')
    const teamsRes = await fetch(`${BASE_URL}/teams?league=39&season=2024`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    })
    const teamsData = await teamsRes.json()
    console.log('   Status:', teamsRes.status)
    console.log('   Results:', teamsData.results)
    console.log('   Errors:', teamsData.errors || 'None')
    if (teamsData.response && teamsData.response.length > 0) {
      console.log('   Sample team:', teamsData.response[0].team?.name)
      console.log('   Total teams:', teamsData.response.length)
    }
  } catch (error) {
    console.error('   Error:', error.message)
  }
}

testAPI().catch(console.error)

