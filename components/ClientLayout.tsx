'use client'

import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import ThemeToggle from './ThemeToggle'

/**
 * ClientLayout Component
 * 
 * Wraps the app with client-side components that need to be
 * rendered only on the client to avoid SSR issues
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on client side
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || savedTheme === 'light') {
          document.documentElement.setAttribute('data-theme', savedTheme)
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
        }
      } catch (error) {
        // Fallback to light theme
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  }, [])

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ThemeToggle />
    </>
  )
}

