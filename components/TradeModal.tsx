'use client'

import { useState } from 'react'
import type { Player } from '@/types/database'

interface TradeModalProps {
  player: Player
  userId: string
  userBalance: number
  userShares?: number
  isOpen: boolean
  onClose: () => void
  onTradeSuccess?: () => void
}

/**
 * TradeModal Component
 * 
 * Modal dialog for buying/selling player shares
 */
export default function TradeModal({
  player,
  userId,
  userBalance,
  userShares = 0,
  isOpen,
  onClose,
  onTradeSuccess
}: TradeModalProps) {
  const [type, setType] = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          player_id: player.id,
          type,
          shares: parseInt(shares)
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: `Trade successful! New price: 🪙${data.newPrice?.toFixed(2) || data.player?.current_price?.toFixed(2) || '0.00'}` 
        })
        setShares('')
        setTimeout(() => {
          onTradeSuccess?.()
          onClose()
        }, 1500)
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Trade failed' 
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const sharesNum = shares ? parseInt(shares) : 0
  const totalCost = sharesNum * player.current_price
  const canBuy = type === 'buy' && sharesNum > 0 && sharesNum <= player.available_shares && totalCost <= userBalance
  const canSell = type === 'sell' && sharesNum > 0 && sharesNum <= userShares

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card-bg, white)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          transition: 'background-color 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary, #333)' }}>Trade {player.name}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary, #666)',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Trade Type
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="buy"
                  checked={type === 'buy'}
                  onChange={(e) => {
                    setType(e.target.value as 'buy' | 'sell')
                    setShares('')
                    setMessage(null)
                  }}
                />
                Buy
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  value="sell"
                  checked={type === 'sell'}
                  onChange={(e) => {
                    setType(e.target.value as 'buy' | 'sell')
                    setShares('')
                    setMessage(null)
                  }}
                  disabled={userShares === 0}
                />
                Sell {userShares > 0 && `(${userShares} owned)`}
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Shares
            </label>
            <input
              type="number"
              min="1"
              max={type === 'buy' ? player.available_shares : userShares}
              value={shares}
              onChange={(e) => {
                setShares(e.target.value)
                setMessage(null)
              }}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {type === 'buy' && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Available: {player.available_shares} shares
              </div>
            )}
          </div>

          <div
            style={{
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Price per share:</span>
              <span>🪙{player.current_price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
              <span>Total {type === 'buy' ? 'Cost' : 'Revenue'}:</span>
              <span>🪙{totalCost.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Your Balance:</span>
                <span>🪙{userBalance.toFixed(2)} R Bucks</span>
              </div>
            </div>
          </div>

          {message && (
            <div
              style={{
                padding: '12px',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !shares || (type === 'buy' ? !canBuy : !canSell)}
            style={{
              width: '100%',
              padding: '12px',
              background: type === 'buy' ? '#22c55e' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !shares || (type === 'buy' ? !canBuy : !canSell) ? 'not-allowed' : 'pointer',
              opacity: loading || !shares || (type === 'buy' ? !canBuy : !canSell) ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : `${type === 'buy' ? 'Buy' : 'Sell'} Shares`}
          </button>
        </form>
      </div>
    </div>
  )
}

