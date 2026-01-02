'use client'

interface TrendLineProps {
  trend: 'up' | 'down'
  percentage: number
}

/**
 * TrendLine Component
 * 
 * Displays a small line graph showing price trend
 */
export default function TrendLine({ trend, percentage }: TrendLineProps) {
  const points = 10
  const width = 60
  const height = 20
  
  // Generate trend data points
  const dataPoints: number[] = []
  const baseValue = 50
  
  // Use deterministic calculation based on percentage instead of random
  if (trend === 'up') {
    // Upward trend - deterministic based on percentage
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      const variation = (percentage / 100) * 2 // Small variation based on percentage
      dataPoints.push(baseValue + (progress * 30) + variation)
    }
  } else {
    // Downward trend - deterministic based on percentage
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      const variation = (percentage / 100) * 2
      dataPoints.push(baseValue - (progress * 30) - variation)
    }
  }
  
  // Normalize to fit height
  const min = Math.min(...dataPoints)
  const max = Math.max(...dataPoints)
  const range = max - min || 1
  
  const normalizedPoints = dataPoints.map(val => 
    height - ((val - min) / range) * height
  )
  
  // Create path
  const pathData = normalizedPoints.map((y, i) => {
    const x = (i / (points - 1)) * width
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block' }}
    >
      <path
        d={pathData}
        fill="none"
        stroke={trend === 'up' ? '#4CAF50' : '#f44336'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

