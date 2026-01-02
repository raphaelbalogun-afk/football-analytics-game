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
    return initialPlayers.filter(player => {
      // Team filter
      if (filters.team !== 'all' && player.team !== filters.team) {
        return false
      }

      // Position filter
      if (filters.position !== 'all' && player.position !== filters.position) {
        return false
      }

      // Search filter
      if (filters.search && !player.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Price filters
      if (filters.minPrice && player.current_price < parseFloat(filters.minPrice)) {
        return false
      }

      if (filters.maxPrice && player.current_price > parseFloat(filters.maxPrice)) {
        return false
      }

      return true
    })
  }, [initialPlayers, filters])

  return (
    <>
      <PlayerFilters players={initialPlayers} onFilterChange={setFilters} />
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        Showing {filteredPlayers.length} of {initialPlayers.length} players
      </div>
      <PlayerMarketList players={filteredPlayers} />
    </>
  )
}

