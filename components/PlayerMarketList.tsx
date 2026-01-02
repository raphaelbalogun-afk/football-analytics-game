import PlayerCard from './PlayerCard'
import type { Player } from '@/types/database'

interface PlayerMarketListProps {
  players: Player[]
  loading?: boolean
}

/**
 * PlayerMarketList Component
 * 
 * Displays a grid of player cards
 */
export default function PlayerMarketList({ players, loading }: PlayerMarketListProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading players...
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No players available.</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Please set up your database with player data.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}
    >
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}

