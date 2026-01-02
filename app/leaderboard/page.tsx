import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import LeaderboardTable from '@/components/LeaderboardTable'

async function getLeaderboard() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/leaderboard`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard()

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
        <h1 style={{ margin: 0 }}>Leaderboard</h1>
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

      <LeaderboardTable entries={leaderboard} />
    </div>
  )
}

