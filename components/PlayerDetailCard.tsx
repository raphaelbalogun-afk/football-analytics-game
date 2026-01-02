'use client'

import { useState } from 'react'
import TrendLine from './TrendLine'
import TradeModal from './TradeModal'
import { getTeamLogo } from '@/lib/utils/team-logos'
import { getCountryFlag } from '@/lib/utils/country-flags'
import type { Player } from '@/types/database'

interface PlayerDetailCardProps {
  player: Player
}

/**
 * PlayerDetailCard Component
 * 
 * Displays detailed player information matching the deployed design
 */
export default function PlayerDetailCard({ player }: PlayerDetailCardProps) {
  const [showTradeModal, setShowTradeModal] = useState(false)
  
  // Calculate initials
  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  // Generate color for initials circle
  const colors = [
    '#FF6B9D', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA',
    '#FCBAD3', '#AAE3E2', '#D9BF77', '#FFD93D', '#6BCB77',
    '#4D96FF', '#9B59B6', '#E74C3C', '#3498DB', '#1ABC9C'
  ]
  const colorIndex = player.name.charCodeAt(0) % colors.length
  const circleColor = colors[colorIndex]
  
      // Calculate price change with deterministic variation
      const basePrice = player.base_price || 25
      const currentPrice = player.current_price || basePrice
      
      // Use player ID for deterministic but varied price changes
      const playerSeed = player.id ? player.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0
      const variationFactor = ((playerSeed * 7919 + 12345) % 200) / 100 - 1 // -1 to +1
      
      // Base price change from actual data
      const actualPriceChange = basePrice > 0 ? ((currentPrice - basePrice) / basePrice) * 100 : 0
      
      // Add deterministic variation: 60% positive, 40% negative
      const isPositive = (playerSeed % 10) < 6
      const variation = isPositive 
        ? Math.abs(variationFactor) * 5 // 0% to +5%
        : -Math.abs(variationFactor) * 5 // -5% to 0%
      
      const priceChange = actualPriceChange + variation
      const trend = priceChange >= 0 ? 'up' : 'down'
      const adjustedCurrentPrice = basePrice * (1 + priceChange / 100)
  
  // Mock data (would come from API)
  const playerAge = (player as any).age || 25
  const nationality = (player as any).nationality || 'Unknown'
  const volatilityFactor = (player as any).volatility_factor || 1.0
  
  return (
    <>
      <div
        style={{
          background: 'var(--card-bg, white)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto',
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: circleColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              flexShrink: 0
            }}
          >
            {initials}
          </div>
          
          {/* Name and Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--text-primary, #333)'
                }}
              >
                {player.name}
              </h1>
              <div style={{ width: '60px', height: '20px' }}>
                <TrendLine trend={trend} percentage={Math.abs(priceChange)} />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Club */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={getTeamLogo(player.team)}
                  alt={player.team}
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const emoji = document.createElement('span')
                      emoji.textContent = '🏟️'
                      emoji.style.fontSize = '20px'
                      parent.insertBefore(emoji, target)
                    }
                  }}
                />
                <span style={{ fontSize: '16px', color: '#666' }}>{player.team}</span>
              </div>
              
              {/* Country */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>{getCountryFlag(nationality)}</span>
                <span style={{ fontSize: '16px', color: '#666' }}>{nationality}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Section - Two Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--card-border, #e0e0e0)'
          }}
        >
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>Position</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary, #333)' }}>
                {player.position === 'GK' ? 'Goalkeeper' : 
                 player.position === 'DEF' ? 'Defender' :
                 player.position === 'MID' ? 'Midfielder' : 'Forward'}
              </div>
            </div>
            
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>Volatility Factor</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary, #333)' }}>
                  {((player.price_cap / player.base_price) * 0.5).toFixed(2)}x
                </div>
              </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>Age</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary, #333)' }}>
                {playerAge}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Price Information */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}
        >
          {/* Current Price */}
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '8px' }}>Current Price</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🪙</span>
              <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary, #333)' }}>
                {currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Base Price */}
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '8px' }}>Base Price</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '24px' }}>🪙</span>
              <span style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary, #333)' }}>
                {basePrice.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: trend === 'up' ? '#4CAF50' : '#f44336'
              }}
            >
              {trend === 'up' ? '+' : ''}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {/* Buy Shares Button */}
        <button
          onClick={() => setShowTradeModal(true)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#45a049'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#4CAF50'
          }}
        >
          Buy Shares
        </button>
      </div>
      
      {showTradeModal && (
        <TradeModal
          player={player}
          userId="demo-user-id"
          userBalance={10000}
          userShares={0}
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          onTradeSuccess={() => {
            setShowTradeModal(false)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}

