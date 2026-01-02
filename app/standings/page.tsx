import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import StandingsTable from '@/components/StandingsTable'

export const dynamic = 'force-dynamic'

export default function StandingsPage() {
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
        <h1 style={{ margin: 0 }}>League Standings</h1>
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

      <StandingsTable />
    </div>
  )
}

