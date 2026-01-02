import Link from 'next/link'
import type { Player } from '@/types/database'

interface PlayerCardProps {
  player: Player
}

/**
 * PlayerCard Component
 * 
 * Displays a single player's market information in a card format
 */
export default function PlayerCard({ player }: PlayerCardProps) {
  const availabilityPercent = (player.available_shares / player.total_shares) * 100

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {player.name}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
            {player.team} • {player.position}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3' }}>
            £{player.current_price.toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#666',
          paddingTop: '8px',
          borderTop: '1px solid #f0f0f0'
        }}
      >
        <div>
          <span style={{ color: '#999' }}>Available: </span>
          <strong>{player.available_shares}</strong> / {player.total_shares}
        </div>
        <div style={{ color: availabilityPercent < 20 ? '#ef4444' : '#22c55e' }}>
          {availabilityPercent.toFixed(0)}%
        </div>
      </div>

      <Link
        href={`/player/${player.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '8px 16px',
          background: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          marginTop: '4px'
        }}
      >
        View Details
      </Link>
    </div>
  )
}

