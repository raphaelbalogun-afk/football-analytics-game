'use client'

import { useState } from 'react'

interface StatsFiltersProps {
  onFilterChange: (filters: StatsFilterState) => void
}

export interface StatsFilterState {
  playerSearch: string
  team: string
  statType: string
  minValue: string
}

/**
 * StatsFilters Component
 * 
 * Filter options for player statistics
 */
export default function StatsFilters({ onFilterChange }: StatsFiltersProps) {
  const [filters, setFilters] = useState<StatsFilterState>({
    playerSearch: '',
    team: 'all',
    statType: 'all',
    minValue: ''
  })

  const handleFilterChange = (key: keyof StatsFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
        Filter Statistics
      </h3>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Player Search */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Search Player
          </label>
          <input
            type="text"
            placeholder="Player name..."
            value={filters.playerSearch}
            onChange={(e) => handleFilterChange('playerSearch', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Team Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Team
          </label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Teams</option>
            <option value="39">Premier League Teams</option>
          </select>
        </div>

        {/* Stat Type */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Stat Type
          </label>
          <select
            value={filters.statType}
            onChange={(e) => handleFilterChange('statType', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Stats</option>
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="rating">Rating</option>
            <option value="minutes">Minutes Played</option>
          </select>
        </div>

        {/* Min Value */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Minimum Value
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minValue}
            onChange={(e) => handleFilterChange('minValue', e.target.value)}
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
            playerSearch: '',
            team: 'all',
            statType: 'all',
            minValue: ''
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

