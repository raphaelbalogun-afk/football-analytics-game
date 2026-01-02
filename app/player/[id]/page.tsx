import DisclaimerBanner from '@/components/DisclaimerBanner'
import PlayerDetailCard from '@/components/PlayerDetailCard'
import Link from 'next/link'
import type { Player } from '@/types/database'

async function getPlayer(id: string): Promise<Player | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/players/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching player:', error)
    return null
  }
}

async function getUserPortfolio(userId: string, playerId: string): Promise<number> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/portfolio?user_id=${userId}`, {
      cache: 'no-store'
    })
    if (!res.ok) return 0
    const data = await res.json()
    const entry = data.data?.find((p: any) => p.player_id === playerId)
    return entry?.shares || 0
  } catch (error) {
    return 0
  }
}

async function getUserBalance(userId: string): Promise<number> {
  try {
    // In a real app, get from Supabase users table
    // For demo, return default balance
    return 100000
  } catch (error) {
    return 100000
  }
}

export default async function PlayerPage({ params }: { params: { id: string } }) {
  // TODO: Get from auth session
  const userId = 'demo-user-id'

  const [player, userShares, userBalance] = await Promise.all([
    getPlayer(params.id),
    getUserPortfolio(userId, params.id),
    getUserBalance(userId)
  ])

  if (!player) {
    return (
      <div className="container">
        <p>Player not found</p>
        <Link href="/market">← Back to Market</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <DisclaimerBanner />
      <PlayerDetailWithTrade
        player={player}
        userId={userId}
        userBalance={userBalance}
        userShares={userShares}
      />
    </div>
  )
}

