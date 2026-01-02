'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Header Component
 * 
 * Main navigation header with logo, tabs, and user menu
 */
export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/market', label: 'Market' },
    { href: '/standings', label: 'Tables' },
    { href: '/statistics', label: 'Statistics' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/leaderboard', label: 'Leaderboard' }
  ]

  const userMenuItems = [
    { icon: '👤', label: 'Personal Information', href: '#' },
    { icon: '💳', label: 'Subscription', href: '#' },
    { icon: '📜', label: 'Legal', href: '#' },
    { icon: 'ℹ️', label: 'About', href: '#' },
    { icon: '❓', label: 'Help', href: '#' },
    { icon: '🚪', label: 'Logout', href: '#' }
  ]

  return (
    <header
      style={{
        background: '#2d2d2d',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #4CAF50 0%, #FFC107 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          ⚽
        </div>
        <Link
          href="/market"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '20px',
            fontWeight: '600'
          }}
        >
          Player Market
        </Link>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                         (item.href === '/market' && pathname === '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: isActive ? '#FFC107' : 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                background: isActive ? 'rgba(255, 193, 7, 0.1)' : 'transparent',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          😊
        </button>

        {userMenuOpen && (
          <>
            <div
              onClick={() => setUserMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {userMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    setUserMenuOpen(false)
                    // Handle menu item clicks here
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    color: '#333',
                    textDecoration: 'none',
                    fontSize: '14px',
                    borderBottom: index < userMenuItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  )
}

