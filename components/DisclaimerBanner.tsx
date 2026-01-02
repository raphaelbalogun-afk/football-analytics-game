/**
 * DisclaimerBanner Component
 * 
 * Displays a prominent disclaimer about the demo nature of the application
 */
export default function DisclaimerBanner() {
  return (
    <div
      style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        padding: '12px 16px',
        margin: '20px 0',
        borderRadius: '4px',
        fontSize: '14px',
        textAlign: 'center',
        lineHeight: '1.5'
      }}
    >
      <strong>⚠️ DISCLAIMER:</strong> This is a DEMO application for entertainment purposes only.{' '}
      All trading is simulated with virtual currency. No real money is involved.{' '}
      No cash-out functionality exists.
    </div>
  )
}

