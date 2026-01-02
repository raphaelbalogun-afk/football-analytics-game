import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import PlayerMarketWithFilters from '@/components/PlayerMarketWithFilters'
import type { Player } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getPlayers(): Promise<Player[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/players`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || data || []
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

export default async function MarketPage() {
  const players = await getPlayers()

  return (
    <div className="container">
      <DisclaimerBanner />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1 style={{ margin: 0 }}>Player Market</h1>
        <Link
          href="/"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Home
        </Link>
      </div>

      <PlayerMarketWithFilters initialPlayers={players} />
    </div>
  )
}

