'use client'

import { useState, useEffect } from 'react'
import LeagueFilters from './LeagueFilters'

interface Standing {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
}

/**
 * StandingsTable Component
 * 
 * Displays league standings/table with filters
 */
export default function StandingsTable() {
  const [leagueId, setLeagueId] = useState(39)
  const [season, setSeason] = useState(2025)
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStandings(leagueId, season)
  }, [leagueId, season])

  const fetchStandings = async (league: number, seasonYear: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/standings?league=${league}&season=${seasonYear}`)
      const data = await res.json()
      
      if (data.success && data.data && data.data.length > 0) {
        // Extract standings from API response
        const leagueData = data.data[0]
        const standingsData = leagueData.league?.standings?.[0] || []
        setStandings(standingsData)
      } else {
        setStandings([])
        setError('No standings data available')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch standings')
      setStandings([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newLeagueId: number, newSeason: number) => {
    setLeagueId(newLeagueId)
    setSeason(newSeason)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading standings...
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
          Make sure API-Football is configured and the league/season is valid.
        </p>
      </div>
    )
  }

  if (standings.length === 0) {
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
        <p>No standings data available for this league/season.</p>
      </div>
    )
  }

  return (
    <>
      <LeagueFilters onFilterChange={handleFilterChange} />
      
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
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Pos
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Team
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Played
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                W
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                D
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                L
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                GD
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr
                key={standing.team.id}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  background: index < 4 ? '#f0f9ff' : index >= standings.length - 3 ? '#fef2f2' : 'white'
                }}
              >
                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500' }}>
                  {standing.rank || index + 1}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {standing.team.logo && (
                      <img
                        src={standing.team.logo}
                        alt={standing.team.name}
                        style={{ width: '24px', height: '24px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                    <span style={{ fontWeight: '500' }}>{standing.team.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {standing.all?.played || 0}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {standing.all?.win || 0}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {standing.all?.draw || 0}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {standing.all?.lose || 0}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {standing.goalsDiff >= 0 ? '+' : ''}{standing.goalsDiff || 0}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold' }}>
                  {standing.points || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

