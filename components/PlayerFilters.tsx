'use client'

import { useState } from 'react'

interface PlayerFiltersProps {
  players: Array<{
    team: string
    position: string
    current_price: number
  }>
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  team: string
  position: string
  minPrice: string
  maxPrice: string
  search: string
}

/**
 * PlayerFilters Component
 * 
 * Filter options for player market
 */
export default function PlayerFilters({ players, onFilterChange }: PlayerFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    team: 'all',
    position: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
  })

  // Get unique teams and positions
  const teams = Array.from(new Set(players.map(p => p.team))).sort()
  const positions = Array.from(new Set(players.map(p => p.position))).sort()

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div
      style={{
        background: 'var(--card-bg, white)',
        border: '1px solid var(--card-border, #e0e0e0)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
        Search and Filter
      </div>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Search */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary, #333)', fontWeight: '500' }}>
            Search by Name
          </label>
          <input
            type="text"
            placeholder="Enter player name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Position Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary, #333)', fontWeight: '500' }}>
            Filter by Position
          </label>
          <select
            value={filters.position}
            onChange={(e) => handleFilterChange('position', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="all">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary, #333)', fontWeight: '500' }}>
            Filter by Club
          </label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="all">All Clubs</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Min Price (£)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Max Price */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Max Price (£)
          </label>
          <input
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const cleared = {
            team: 'all',
            position: 'all',
            minPrice: '',
            maxPrice: '',
            search: ''
          }
          setFilters(cleared)
          onFilterChange(cleared)
        }}
        style={{
          marginTop: '12px',
          padding: '6px 16px',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Clear Filters
      </button>
    </div>
  )
}

