import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import PortfolioView from '@/components/PortfolioView'
import type { Player } from '@/types/database'

interface PortfolioHolding {
  player: Player
  shares: number
  basePrice: number
  currentPrice: number
  totalValue: number
  priceChange: number
  priceChangePercent: number
  valueChange: number
  valueChangePercent: number
}

async function getPortfolio(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/portfolio?user_id=${userId}`, {
      cache: 'no-store'
    })
    if (!res.ok) {
      return { holdings: [], virtualBalance: 10000, totalValue: 0 }
    }
    const result = await res.json()
    
    // Transform API response to holdings format
    const holdings: PortfolioHolding[] = (result.portfolio || []).map((item: any) => ({
      player: item.player || {
        id: item.player_id,
        name: item.player_name || 'Unknown',
        team: 'Unknown',
        position: 'MID' as const,
        base_price: item.base_price || 25,
        current_price: item.current_price || 25,
        price_cap: 100,
        price_floor: 1,
        total_shares: 1000,
        available_shares: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      shares: item.shares || 0,
      basePrice: item.base_price || item.current_price || 25,
      currentPrice: item.current_price || 25,
      totalValue: item.total_value || 0,
      priceChange: item.price_change || 0,
      priceChangePercent: item.price_change_percent || 0,
      valueChange: item.value_change || 0,
      valueChangePercent: item.value_change_percent || 0
    }))
    
    return {
      holdings,
      virtualBalance: result.virtual_balance || 10000,
      totalValue: result.total_value || 0
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return { holdings: [], virtualBalance: 10000, totalValue: 0 }
  }
}

export default async function PortfolioPage() {
  // TODO: Get from auth session
  const userId = 'demo-user-id'

  const { holdings, virtualBalance, totalValue } = await getPortfolio(userId)

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

      <PortfolioView 
        holdings={holdings} 
        virtualBalance={virtualBalance}
        totalValue={totalValue}
      />
    </div>
  )
}

