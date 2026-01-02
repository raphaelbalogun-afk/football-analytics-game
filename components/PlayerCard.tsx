'use client'

import Link from 'next/link'
import TrendLine from './TrendLine'
import { getTeamLogo } from '@/lib/utils/team-logos'
import { getCountryFlag } from '@/lib/utils/country-flags'
import type { Player } from '@/types/database'

interface PlayerCardProps {
  player: Player
}

/**
 * PlayerCard Component
 * 
 * Displays player information in a card format matching the deployed design
 */
export default function PlayerCard({ player }: PlayerCardProps) {
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
  
  // Calculate price change with random variation
  const basePrice = player.base_price || 25
  const currentPrice = player.current_price || basePrice
  
  // Add random variation to price change for demo
  const randomVariation = (Math.random() - 0.5) * 10 // -5% to +5%
  const priceChange = ((currentPrice - basePrice) / basePrice) * 100 + randomVariation
  const trend = priceChange >= 0 ? 'up' : 'down'
  
  // Get nationality and age from player data
  const nationality = (player as any).nationality || 'Unknown'
  const playerAge = (player as any).age || 25
  
  return (
    <Link
      href={`/player/${player.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          border: '1px solid #e0e0e0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Initials Circle */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: circleColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}
        >
          {initials}
        </div>
        
        {/* Player Name */}
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}
        >
          {player.name}
        </h3>
        
        {/* Club with Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#666'
          }}
        >
          <img
            src={getTeamLogo(player.team)}
            alt={player.team}
            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
              const parent = (e.target as HTMLImageElement).parentElement
              if (parent) {
                const emoji = document.createElement('span')
                emoji.textContent = '🏟️'
                emoji.style.fontSize = '16px'
                parent.insertBefore(emoji, e.target)
              }
            }}
          />
          <span>{player.team}</span>
        </div>
        
        {/* Position */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
            marginBottom: '12px'
          }}
        >
          {player.position}
        </div>
        
        {/* Trend Line */}
        <div style={{ marginBottom: '8px' }}>
          <TrendLine trend={trend} percentage={Math.abs(priceChange)} />
        </div>
        
        {/* Value with Coin Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}
        >
          <span style={{ fontSize: '18px' }}>🪙</span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333'
            }}
          >
            {currentPrice.toFixed(2)}
          </span>
        </div>
        
        {/* Change Percentage */}
        <div
          style={{
            fontSize: '14px',
            color: trend === 'up' ? '#4CAF50' : '#f44336',
            fontWeight: '500',
            marginBottom: '12px'
          }}
        >
          {trend === 'up' ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
        
        {/* Age and Nationality */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: '#999',
            paddingTop: '8px',
            borderTop: '1px solid #f0f0f0'
          }}
        >
          <span>Age: {playerAge}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {getCountryFlag(nationality)}
            <span>{nationality}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
