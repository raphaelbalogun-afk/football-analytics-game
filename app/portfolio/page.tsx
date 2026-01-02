import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import PortfolioDashboard from '@/components/PortfolioDashboard'

async function getPortfolio(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/portfolio?user_id=${userId}`, {
      cache: 'no-store'
    })
    if (!res.ok) {
      return { data: [], summary: getDefaultSummary() }
    }
    const result = await res.json()
    return {
      data: result.data || [],
      summary: result.summary || getDefaultSummary()
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return { data: [], summary: getDefaultSummary() }
  }
}

function getDefaultSummary() {
  return {
    virtualBalance: 100000,
    totalValue: 100000,
    totalHoldings: 0,
    portfolioValue: 0,
    totalCostBasis: 0,
    totalPnL: 0,
    totalPnLPercent: 0
  }
}

export default async function PortfolioPage() {
  // TODO: Get from auth session
  const userId = 'demo-user-id'

  const { data, summary } = await getPortfolio(userId)

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
        <h1 style={{ margin: 0 }}>Portfolio</h1>
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

      <PortfolioDashboard entries={data} summary={summary} />
    </div>
  )
}

