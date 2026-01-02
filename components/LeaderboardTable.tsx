interface LeaderboardEntry {
  rank: number
  user_id: string
  email: string
  virtual_balance: number
  portfolio_value: number
  total_value: number
  holdings_count: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  loading?: boolean
}

/**
 * LeaderboardTable Component
 * 
 * Displays leaderboard rankings in a table format
 */
export default function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading leaderboard...
      </div>
    )
  }

  if (entries.length === 0) {
    return (
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
        <p style={{ margin: 0 }}>No users found.</p>
      </div>
    )
  }

  return (
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
            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
              Rank
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>
              User
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
              Balance
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
              Portfolio
            </th>
            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#666' }}>
              Total Value
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.user_id}
              style={{
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <td
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: entry.rank <= 3 ? 'bold' : 'normal',
                  fontSize: entry.rank <= 3 ? '16px' : '14px'
                }}
              >
                #{entry.rank}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ fontWeight: '500' }}>{entry.email}</div>
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#666' }}>
                £{entry.virtual_balance.toFixed(2)}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#666' }}>
                £{entry.portfolio_value.toFixed(2)}
              </td>
              <td
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#0070f3'
                }}
              >
                £{entry.total_value.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

