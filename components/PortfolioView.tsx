'use client'

import { useState } from 'react'
import PortfolioList from './PortfolioList'
import PortfolioPieChart from './PortfolioPieChart'
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

interface PortfolioViewProps {
  holdings: PortfolioHolding[]
  virtualBalance: number
  totalValue: number
}

type ViewMode = 'list' | 'chart'

/**
 * PortfolioView Component
 * 
 * Main portfolio component with toggle between list and pie chart views
 */
export default function PortfolioView({ holdings, virtualBalance, totalValue }: PortfolioViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  return (
    <div>
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Virtual Balance</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            🪙{virtualBalance.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Portfolio Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            🪙{totalValue.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Total Value</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3' }}>
            🪙{(virtualBalance + totalValue).toFixed(2)}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '12px 16px'
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
          {holdings.length} Holdings
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'list' ? '#0070f3' : '#f5f5f5',
              color: viewMode === 'list' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('chart')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'chart' ? '#0070f3' : '#f5f5f5',
              color: viewMode === 'chart' ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Pie Chart
          </button>
        </div>
      </div>

      {/* Content */}
      {holdings.length === 0 ? (
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
          <p style={{ margin: 0, fontSize: '16px' }}>No holdings yet.</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Start trading in the{' '}
            <a href="/market" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Player Market
            </a>
            .
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <PortfolioList holdings={holdings} />
      ) : (
        <div
          style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '24px'
          }}
        >
          <PortfolioPieChart holdings={holdings} />
        </div>
      )}
    </div>
  )
}

