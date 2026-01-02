'use client'

import type { Player } from '@/types/database'

interface PortfolioHolding {
  player: Player
  shares: number
  totalValue: number
}

interface PortfolioPieChartProps {
  holdings: PortfolioHolding[]
}

/**
 * PortfolioPieChart Component
 * 
 * Displays portfolio holdings as a 3D pie chart
 */
export default function PortfolioPieChart({ holdings }: PortfolioPieChartProps) {
  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0)
  
  // Generate colors for each slice
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7CAC9', '#88B04B', '#FFD700', '#DA70D6', '#ADD8E6',
    '#FFB347', '#87CEEB', '#DDA0DD', '#F0E68C', '#98FB98',
    '#FF6347', '#40E0D0', '#FF69B4', '#00CED1', '#FFD700',
    '#32CD32', '#FF1493', '#00BFFF', '#FF4500', '#9370DB',
    '#20B2AA', '#FF8C00', '#BA55D3', '#00FA9A', '#1E90FF'
  ]
  
  // Calculate angles for pie chart
  let currentAngle = -90 // Start at top
  const slices = holdings.map((holding, index) => {
    const percentage = (holding.totalValue / totalValue) * 100
    const angle = (holding.totalValue / totalValue) * 360
    const startAngle = currentAngle
    currentAngle += angle
    const endAngle = currentAngle
    
    return {
      ...holding,
      percentage,
      angle,
      startAngle,
      endAngle,
      color: colors[index % colors.length]
    }
  })
  
  // Create SVG path for each slice
  const createSlicePath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(200, 200, radius, startAngle)
    const end = polarToCartesian(200, 200, radius, endAngle)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return [
      `M 200 200`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `Z`
    ].join(' ')
  }
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }
  
  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Pie Chart */}
      <div style={{ flex: '0 0 auto' }}>
        <svg width="400" height="400" viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
          <defs>
            {slices.map((slice, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={slice.color} stopOpacity="1" />
                <stop offset="100%" stopColor={slice.color} stopOpacity="0.7" />
              </linearGradient>
            ))}
          </defs>
          {slices.map((slice, index) => {
            const path = createSlicePath(slice.startAngle, slice.endAngle, 150)
            return (
              <path
                key={index}
                d={path}
                fill={`url(#gradient-${index})`}
                stroke="#1a1a1a"
                strokeWidth="2"
                style={{
                  transform: `translateZ(${index * 2}px)`,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              />
            )
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Holdings Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
          {slices
            .sort((a, b) => b.totalValue - a.totalValue)
            .map((slice, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    background: slice.color,
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, color: '#fff', fontSize: '14px' }}>
                  {slice.player.name}
                </div>
                <div style={{ color: '#999', fontSize: '12px', marginRight: '8px' }}>
                  {slice.percentage.toFixed(1)}%
                </div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500', minWidth: '80px', textAlign: 'right' }}>
                  🪙{slice.totalValue.toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

