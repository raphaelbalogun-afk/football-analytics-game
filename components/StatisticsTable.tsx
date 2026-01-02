'use client'

import { useState, useEffect, useMemo } from 'react'
import StatsFilters, { type StatsFilterState } from './StatsFilters'

interface PlayerStat {
  player: {
    id: number
    name: string
    photo: string
  }
  statistics: Array<{
    team: {
      id: number
      name: string
    }
    games: {
      position: string
      rating: string
      minutes: number
    }
    goals: {
      total: number
      assists: number
    }
    cards: {
      yellow: number
      red: number
    }
  }>
}

/**
 * StatisticsTable Component
 * 
 * Displays player statistics with filters
 */
export default function StatisticsTable() {
  const [filters, setFilters] = useState<StatsFilterState>({
    playerSearch: '',
    team: 'all',
    statType: 'all',
    minValue: ''
  })
  const [stats, setStats] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch player stats for EPL (league 39, season 2024)
    fetchPlayerStats()
  }, [])

  const fetchPlayerStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // First, get players from our database
      const playersRes = await fetch('/api/players')
      const playersData = await playersRes.json()
      const players = playersData.data || playersData || []
      
      if (players.length === 0) {
        setError('No players available. Please sync players from API-Football first.')
        setLoading(false)
        return
      }
      
      // For demo purposes, we'll show players from our database
      // In production, you would fetch detailed stats from API-Football
      // This requires individual API calls per player or team, which can be rate-limited
      
      // Transform our player data into a stats-like format
      const statsData = players.slice(0, 50).map((player: any) => ({
        player: {
          id: player.id,
          name: player.name,
          photo: null
        },
        statistics: [{
          team: {
            id: 0,
            name: player.team || 'Unknown'
          },
          games: {
            position: player.position || 'Unknown',
            rating: '0.0',
            minutes: 0
          },
          goals: {
            total: 0,
            assists: 0
          },
          cards: {
            yellow: 0,
            red: 0
          }
        }]
      }))
      
      setStats(statsData)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics')
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStats = useMemo(() => {
    return stats.filter((stat: any) => {
      const playerName = stat.player?.name || ''
      const teamName = stat.statistics?.[0]?.team?.name || ''
      
      // Player search
      if (filters.playerSearch && !playerName.toLowerCase().includes(filters.playerSearch.toLowerCase())) {
        return false
      }

      // Team filter
      if (filters.team !== 'all') {
        // Team filtering would need team ID mapping
      }

      // Stat type and min value filtering
      if (filters.statType !== 'all' && filters.minValue) {
        const minVal = parseFloat(filters.minValue)
        const statValue = getStatValue(stat, filters.statType)
        if (statValue < minVal) return false
      }

      return true
    })
  }, [stats, filters])

  const getStatValue = (stat: any, statType: string): number => {
    const statsData = stat.statistics?.[0]
    switch (statType) {
      case 'goals':
        return statsData?.goals?.total || 0
      case 'assists':
        return statsData?.goals?.assists || 0
      case 'rating':
        return parseFloat(statsData?.games?.rating || '0') || 0
      case 'minutes':
        return statsData?.games?.minutes || 0
      default:
        return 0
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading statistics...
      </div>
    )
  }

  if (error) {
    return (
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
        <p>Error: {error}</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Statistics will be available after syncing players from API-Football.
        </p>
      </div>
    )
  }

  return (
    <>
      <StatsFilters onFilterChange={setFilters} />
      
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        Showing {filteredStats.length} of {stats.length} players
      </div>

      {filteredStats.length === 0 ? (
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
          <p>No statistics match your filters.</p>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Player
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Team
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Goals
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Assists
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Rating
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  Minutes
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat: any) => {
                const statsData = stat.statistics?.[0]
                return (
                  <tr
                    key={stat.player?.id}
                    style={{
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {stat.player?.photo && (
                          <img
                            src={stat.player.photo}
                            alt={stat.player.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                        <span style={{ fontWeight: '500' }}>{stat.player?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {statsData?.team?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500' }}>
                      {statsData?.goals?.total || 0}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500' }}>
                      {statsData?.goals?.assists || 0}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {parseFloat(statsData?.games?.rating || '0').toFixed(1) || '0.0'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {statsData?.games?.minutes || 0}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

