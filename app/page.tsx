import Link from 'next/link'
import DisclaimerBanner from '@/components/DisclaimerBanner'

export default function Home() {
  return (
    <div className="container">
      <DisclaimerBanner />
      
      <h1 style={{ marginBottom: '8px' }}>Football Analytics Game</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Simulated trading game for EPL players</p>
      
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', flexWrap: 'wrap', padding: 0 }}>
          <li>
            <Link href="/market" style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Player Market
            </Link>
          </li>
          <li>
            <Link href="/portfolio" style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/leaderboard" style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Leaderboard
            </Link>
          </li>
          <li>
            <Link href="/standings" style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              League Tables
            </Link>
          </li>
          <li>
            <Link href="/statistics" style={{ 
              padding: '12px 24px', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px',
              display: 'inline-block',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Statistics
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

