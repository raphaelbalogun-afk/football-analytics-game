'use client'

import { useState, useMemo } from 'react'
import PlayerMarketList from './PlayerMarketList'
import PlayerFilters, { type FilterState } from './PlayerFilters'
import type { Player } from '@/types/database'

interface PlayerMarketWithFiltersProps {
  initialPlayers: Player[]
}

/**
 * PlayerMarketWithFilters Component
 * 
 * Client component that wraps PlayerMarketList with filtering
 */
export default function PlayerMarketWithFilters({ initialPlayers }: PlayerMarketWithFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    team: 'all',
    position: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
  })

  const filteredPlayers = useMemo(() => {
    if (!initialPlayers || initialPlayers.length === 0) return []
    
    return initialPlayers.filter(player => {
      if (!player) return false
      
      // Team filter
      if (filters.team && filters.team !== 'all' && player.team !== filters.team) {
        return false
      }

      // Position filter
      if (filters.position && filters.position !== 'all' && player.position !== filters.position) {
        return false
      }

      // Search filter
      if (filters.search && player.name && !player.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Price filters
      if (filters.minPrice && player.current_price && player.current_price < parseFloat(filters.minPrice)) {
        return false
      }

      if (filters.maxPrice && player.current_price && player.current_price > parseFloat(filters.maxPrice)) {
        return false
      }

      return true
    })
  }, [initialPlayers, filters])

  return (
    <>
      <PlayerFilters players={initialPlayers} onFilterChange={setFilters} />
      <div style={{ fontSize: '14px', color: 'var(--text-secondary, #666)', marginBottom: '20px', fontWeight: '500' }}>
        Showing {filteredPlayers.length} of {initialPlayers.length} players
      </div>
      <PlayerMarketList players={filteredPlayers} />
    </>
  )
}

