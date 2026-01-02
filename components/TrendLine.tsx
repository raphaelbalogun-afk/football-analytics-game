'use client'

interface TrendLineProps {
  trend: 'up' | 'down'
  percentage: number
  playerId?: string // For deterministic variations
}

/**
 * TrendLine Component
 * 
 * Displays a detailed line graph showing price trend with realistic fluctuations
 * Similar to stock/crypto charts with baseline and price movement line
 */
export default function TrendLine({ trend, percentage, playerId = '' }: TrendLineProps) {
  const points = 50 // More points for smoother, more detailed line
  const width = 120 // Wider for better detail
  const height = 40 // Taller for better visibility
  const padding = 4
  
  // Generate realistic trend data with fluctuations
  const dataPoints: number[] = []
  const baseline = height / 2 // Baseline in the middle
  
  // Use playerId for deterministic but varied patterns
  const seed = playerId ? playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0
  
  if (trend === 'up') {
    // Upward trend with realistic fluctuations
    const startValue = baseline + (height * 0.1) // Start slightly above baseline
    const endValue = baseline - (height * 0.3) // End well above baseline (upward trend)
    const magnitude = Math.abs(percentage) / 10 // Scale based on percentage
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      
      // Main trend line (upward)
      const trendValue = startValue - (progress * (startValue - endValue))
      
      // Add realistic fluctuations (waves and noise)
      const wave1 = Math.sin(progress * Math.PI * 4) * 3 * magnitude
      const wave2 = Math.sin(progress * Math.PI * 8) * 1.5 * magnitude
      const noise = ((seed + i * 7919) % 100) / 100 * 2 * magnitude - magnitude
      
      // Combine for realistic price movement
      const value = trendValue + wave1 + wave2 + noise
      dataPoints.push(value)
    }
  } else {
    // Downward trend with realistic fluctuations
    const startValue = baseline - (height * 0.1) // Start slightly below baseline
    const endValue = baseline + (height * 0.3) // End well below baseline (downward trend)
    const magnitude = Math.abs(percentage) / 10 // Scale based on percentage
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      
      // Main trend line (downward)
      const trendValue = startValue + (progress * (endValue - startValue))
      
      // Add realistic fluctuations
      const wave1 = Math.sin(progress * Math.PI * 4) * 3 * magnitude
      const wave2 = Math.sin(progress * Math.PI * 8) * 1.5 * magnitude
      const noise = ((seed + i * 7919) % 100) / 100 * 2 * magnitude - magnitude
      
      // Combine for realistic price movement
      const value = trendValue + wave1 + wave2 + noise
      dataPoints.push(value)
    }
  }
  
  // Normalize to fit within bounds
  const min = Math.min(...dataPoints)
  const max = Math.max(...dataPoints)
  const range = max - min || 1
  
  const normalizedPoints = dataPoints.map(val => {
    const normalized = ((val - min) / range) * (height - padding * 2) + padding
    return Math.max(padding, Math.min(height - padding, normalized))
  })
  
  // Create smooth path with curves
  const pathData = normalizedPoints.map((y, i) => {
    const x = padding + (i / (points - 1)) * (width - padding * 2)
    if (i === 0) {
      return `M ${x} ${y}`
    } else if (i === points - 1) {
      return `L ${x} ${y}`
    } else {
      // Use quadratic curves for smoother lines
      const prevY = normalizedPoints[i - 1]
      const nextY = normalizedPoints[i + 1]
      const cpX = x
      const cpY = (prevY + nextY) / 2
      return `Q ${x} ${y} ${x} ${y}`
    }
  }).join(' ')
  
  // Baseline (dotted line)
  const baselineY = baseline
  const baselinePath = `M ${padding} ${baselineY} L ${width - padding} ${baselineY}`
  
  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block' }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Baseline (dotted line) */}
      <path
        d={baselinePath}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      
      {/* Price movement line */}
      <path
        d={pathData}
        fill="none"
        stroke={trend === 'up' ? '#22c55e' : '#ef4444'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

