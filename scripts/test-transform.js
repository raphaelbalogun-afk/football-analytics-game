/**
 * Test player transformation
 */

const sampleApiPlayer = {
  player: {
    id: 123,
    name: "Test Player",
    age: 25,
    position: "Attacker",
    photo: "https://example.com/photo.jpg"
  },
  statistics: [{
    team: {
      id: 1,
      name: "Manchester United"
    },
    games: {
      position: "Attacker",
      rating: "7.5",
      minutes: 1800
    },
    goals: {
      total: 10,
      assists: 5
    },
    cards: {
      yellow: 2,
      red: 0
    }
  }]
}

console.log('Sample API Player:', JSON.stringify(sampleApiPlayer, null, 2))

// Test the transform logic
function mapPosition(apiPosition) {
  const pos = (apiPosition || '').toUpperCase()
  
  if (pos.includes('GOALKEEPER') || pos === 'G') return 'GK'
  if (pos.includes('DEFENDER') || pos.includes('BACK')) return 'DEF'
  if (pos.includes('MIDFIELDER') || pos.includes('MID')) return 'MID'
  if (pos.includes('ATTACKER') || pos.includes('FORWARD') || pos.includes('WINGER')) return 'FWD'
  
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'DEF'
  if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(pos)) return 'MID'
  if (['ST', 'CF', 'LW', 'RW', 'LF', 'RF'].includes(pos)) return 'FWD'
  
  return 'MID'
}

function calculateBasePrice(player) {
  const stats = player.statistics?.[0]
  if (!stats) return 25.00
  
  let price = 20.00
  
  if (stats.goals?.total) {
    price += stats.goals.total * 2.5
  }
  
  if (stats.goals?.assists) {
    price += stats.goals.assists * 1.5
  }
  
  if (stats.games?.rating) {
    const rating = parseFloat(stats.games.rating) || 6.0
    if (rating > 7.0) price += (rating - 7.0) * 5
  }
  
  const age = player.player.age || 25
  if (age < 23) price *= 1.2
  else if (age > 30) price *= 0.9
  
  const position = mapPosition(stats.games?.position || player.player.position)
  const positionMultiplier = {
    'FWD': 1.3,
    'MID': 1.1,
    'DEF': 1.0,
    'GK': 0.9
  }[position] || 1.0
  
  price *= positionMultiplier
  
  return Math.max(10.00, Math.min(price, 100.00))
}

const position = mapPosition(sampleApiPlayer.statistics[0].games.position)
const basePrice = calculateBasePrice(sampleApiPlayer)

console.log('\nTransformed:')
console.log('Position:', position)
console.log('Base Price:', basePrice)

