'use client'

import { useState, useEffect } from 'react'

interface LeagueFiltersProps {
  onFilterChange: (leagueId: number, season: number) => void
}

/**
 * LeagueFilters Component
 * 
 * Filter options for league standings/table
 */
export default function LeagueFilters({ onFilterChange }: LeagueFiltersProps) {
  const [leagueId, setLeagueId] = useState(39) // EPL default
  const [season, setSeason] = useState(2025)
  const [leagues, setLeagues] = useState<Array<{ id: number, name: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch available leagues
    fetch('/api/leagues')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const leagueList = data.data
            .map((l: any) => ({
              id: l.league?.id || l.id,
              name: l.league?.name || l.name || 'Unknown'
            }))
            .filter((l: any) => l.id && l.name !== 'Unknown')
            .slice(0, 20) // Limit to first 20
          setLeagues(leagueList)
        }
        setLoading(false)
      })
      .catch(() => {
        // Default leagues if API fails
        setLeagues([
          { id: 39, name: 'Premier League' },
          { id: 140, name: 'La Liga' },
          { id: 135, name: 'Serie A' },
          { id: 78, name: 'Bundesliga' },
          { id: 61, name: 'Ligue 1' }
        ])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    onFilterChange(leagueId, season)
  }, [leagueId, season, onFilterChange])

  const currentYear = new Date().getFullYear()
  const seasons = Array.from({ length: 5 }, (_, i) => currentYear - i)

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
        Filter League Table
      </h3>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        {/* League Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            League
          </label>
          <select
            value={leagueId}
            onChange={(e) => setLeagueId(parseInt(e.target.value))}
            disabled={loading}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {loading ? (
              <option>Loading leagues...</option>
            ) : (
              leagues.map(league => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Season Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#666' }}>
            Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {seasons.map(year => (
              <option key={year} value={year}>
                {year}/{year + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

