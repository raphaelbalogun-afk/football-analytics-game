/**
 * Footer Component
 * 
 * Application footer with legal disclaimers
 */
export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--footer-bg, #2d2d2d)',
        color: 'var(--footer-text, #999)',
        padding: '24px',
        marginTop: '60px',
        textAlign: 'center',
        fontSize: '12px',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong style={{ color: '#fff' }}>Disclaimer:</strong> This is a simulated, entertainment-only experience. 
          No real-world ownership. No financial investment. No monetary value. 
          All trading is virtual with virtual currency only.
        </p>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          © {new Date().getFullYear()} Football Analytics Game. Entertainment Only.
        </p>
      </div>
    </footer>
  )
}

