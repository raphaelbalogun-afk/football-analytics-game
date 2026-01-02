'use client'

import { useEffect, useState } from 'react'

/**
 * ThemeToggle Component
 * 
 * Toggle button for switching between light and dark mode
 * Positioned at the bottom of the page
 * Only renders on client-side to avoid SSR issues
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    setMounted(true)
    
    try {
      // Get initial theme from localStorage or system preference
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initialTheme = prefersDark ? 'dark' : 'light'
        setTheme(initialTheme)
        document.documentElement.setAttribute('data-theme', initialTheme)
      }
    } catch (error) {
      // Fallback to light theme if there's any error
      console.error('Error loading theme:', error)
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    } catch (error) {
      console.error('Error toggling theme:', error)
    }
  }

  // Don't render during SSR to avoid hydration mismatches
  // Return a placeholder with the same dimensions to prevent layout shift
  if (!mounted) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          zIndex: 1000
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      <button
        onClick={toggleTheme}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: theme === 'dark' ? '#2d2d2d' : '#f5f5f5',
          border: `2px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
          color: theme === 'dark' ? '#FFD700' : '#333',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
        }}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

