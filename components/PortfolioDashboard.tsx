interface PortfolioEntry {
  id: string
  player: {
    id: string
    name: string
    team: string
    position: string
    currentPrice: number
  }
  shares: number
  averageBuyPrice: number
  currentValue: number
  costBasis: number
  pnl: number
  pnlPercent: number
}

interface PortfolioSummary {
  virtualBalance: number
  totalValue: number
  totalHoldings: number
  portfolioValue: number
  totalCostBasis: number
  totalPnL: number
  totalPnLPercent: number
}

interface PortfolioDashboardProps {
  entries: PortfolioEntry[]
  summary: PortfolioSummary
  loading?: boolean
}

/**
 * PortfolioDashboard Component
 * 
 * Displays user's portfolio with holdings, values, and P&L
 */
export default function PortfolioDashboard({ entries, summary, loading }: PortfolioDashboardProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading portfolio...
      </div>
    )
  }

  return (
    <div>
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Virtual Balance</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            £{summary.virtualBalance.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Portfolio Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            £{summary.portfolioValue.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Total Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3' }}>
            £{summary.totalValue.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Total P&L</div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: summary.totalPnL >= 0 ? '#22c55e' : '#ef4444'
            }}
          >
            {summary.totalPnL >= 0 ? '+' : ''}£{summary.totalPnL.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      {entries.length === 0 ? (
        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            color: '#666'
          }}
        >
          <p style={{ margin: 0, fontSize: '16px' }}>No holdings yet.</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Start trading in the{' '}
            <a href="/market" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Player Market
            </a>
            .
          </p>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Player
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Shares
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Avg Buy
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Current
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Value
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  P&L
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{entry.player.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {entry.player.team} • {entry.player.position}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>
                    {entry.shares}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: '#666' }}>
                    £{entry.averageBuyPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>
                    £{entry.player.currentPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>
                    £{entry.currentValue.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: '500',
                      color: entry.pnl >= 0 ? '#22c55e' : '#ef4444'
                    }}
                  >
                    {entry.pnl >= 0 ? '+' : ''}£{entry.pnl.toFixed(2)}
                    <div style={{ fontSize: '12px', marginTop: '2px' }}>
                      ({entry.pnlPercent >= 0 ? '+' : ''}
                      {entry.pnlPercent.toFixed(2)}%)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

