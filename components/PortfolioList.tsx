'use client'

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

interface PortfolioListProps {
  holdings: PortfolioHolding[]
}

/**
 * PortfolioList Component
 * 
 * Displays portfolio holdings in a list format matching the provided design
 */
export default function PortfolioList({ holdings }: PortfolioListProps) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2d2d2d', borderBottom: '2px solid #333' }}>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#999' }}>
              Player Name
            </th>
            <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#999' }}>
              Base Price
            </th>
            <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#999' }}>
              Holdings
            </th>
            <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#999' }}>
              Total Value
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr
              key={holding.player.id}
              style={{
                borderBottom: index < holdings.length - 1 ? '1px solid #2d2d2d' : 'none',
                background: index % 2 === 0 ? '#1a1a1a' : '#1f1f1f'
              }}
            >
              {/* Player Name */}
              <td style={{ padding: '16px' }}>
                <div style={{ color: '#fff', fontWeight: '500', fontSize: '14px' }}>
                  {holding.player.name}
                </div>
              </td>
              
              {/* Base Price with Change */}
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  🪙{holding.currentPrice.toFixed(2)}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: holding.priceChange >= 0 ? '#22c55e' : '#ef4444',
                    fontWeight: '500'
                  }}
                >
                  {holding.priceChange >= 0 ? '+' : ''}🪙{Math.abs(holding.priceChange).toFixed(2)} ({holding.priceChangePercent >= 0 ? '+' : ''}{holding.priceChangePercent.toFixed(2)}%)
                </div>
              </td>
              
              {/* Holdings/Quantity */}
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                  {holding.shares.toLocaleString()} shares
                </div>
              </td>
              
              {/* Total Value with Change */}
              <td style={{ padding: '16px', textAlign: 'right' }}>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  🪙{holding.totalValue.toFixed(2)}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: holding.valueChange >= 0 ? '#22c55e' : '#ef4444',
                    fontWeight: '500'
                  }}
                >
                  {holding.valueChange >= 0 ? '+' : ''}🪙{Math.abs(holding.valueChange).toFixed(2)} ({holding.valueChangePercent >= 0 ? '+' : ''}{holding.valueChangePercent.toFixed(2)}%)
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

