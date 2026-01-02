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
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <DisclaimerBanner />

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px'
        }}
      >
        <h1
          style={{
            margin: '0 0 24px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#333'
          }}
        >
          Player Market
        </h1>

        <PlayerMarketWithFilters initialPlayers={players} />
      </div>
    </div>
  )
}
