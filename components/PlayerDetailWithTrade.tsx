'use client'

import { useState } from 'react'
import Link from 'next/link'
import TradeModal from './TradeModal'
import type { Player } from '@/types/database'

interface PlayerDetailWithTradeProps {
  player: Player
  userId: string
  userBalance: number
  userShares?: number
}

/**
 * PlayerDetailWithTrade Component
 * 
 * Client component wrapper that combines player detail view with trade modal
 */
export default function PlayerDetailWithTrade({
  player,
  userId,
  userBalance,
  userShares = 0
}: PlayerDetailWithTradeProps) {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  const handleTradeSuccess = () => {
    window.location.reload()
  }

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/market"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Market
        </Link>
      </div>

      <div
        style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>{player.name}</h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
            {player.team} • {player.position}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #f0f0f0'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Current Price</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>
              £{player.current_price.toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Price Range</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              £{player.price_floor.toFixed(2)} - £{player.price_cap.toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Available Shares</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>
              {player.available_shares} / {player.total_shares}
            </div>
          </div>

          {userShares > 0 && (
            <div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Your Holdings</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{userShares} shares</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setIsTradeModalOpen(true)}
          style={{
            padding: '12px 24px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {userShares > 0 ? 'Trade Shares' : 'Buy Shares'}
        </button>
      </div>

      <TradeModal
        player={player}
        userId={userId}
        userBalance={userBalance}
        userShares={userShares}
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onTradeSuccess={handleTradeSuccess}
      />
    </>
  )
}

