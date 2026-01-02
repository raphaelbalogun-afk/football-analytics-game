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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="PlayerMarket animated favicon"
          >
            <rect width="64" height="64" rx="12" fill="#111827" />
            <polygon
              points="32,6 42,20 38,20 38,32 26,32 26,20 22,20"
              fill="#22C55E"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="0 -2"
                dur="1.4s"
                repeatCount="indefinite"
                direction="alternate"
              />
            </polygon>
            <polygon
              points="32,58 42,44 38,44 38,32 26,32 26,44 22,44"
              fill="#EF4444"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="0 2"
                dur="1.4s"
                repeatCount="indefinite"
                direction="alternate"
              />
            </polygon>
            <circle cx="32" cy="32" r="12" fill="#FACC15" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="0 1"
                dur="1.2s"
                repeatCount="indefinite"
                direction="alternate"
              />
              <path
                d="M24 32 C26 30, 30 30, 32 32 C34 34, 38 34, 40 32"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M23 31 C21 29, 20 28, 19 27"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M41 31 C43 29, 44 28, 45 27"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
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
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Donut user icon"
          >
            <circle cx="24" cy="24" r="18" fill="#F5C542" />
            <circle cx="24" cy="24" r="8" fill="#111827" />
            <path
              d="M12 18 C14 16, 18 16, 20 18 C22 20, 26 20, 28 18 C30 16, 34 16, 36 18"
              stroke="#E879F9"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
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

