'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mounted) return // Prevent re-running if already mounted
    
    try {
      // Check localStorage for saved theme preference
      let initialTheme: Theme = 'light'
      
      try {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme === 'light' || savedTheme === 'dark') {
          initialTheme = savedTheme
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          initialTheme = prefersDark ? 'dark' : 'light'
        }
      } catch (storageError) {
        // localStorage might not be available, use system preference
        try {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          initialTheme = prefersDark ? 'dark' : 'light'
        } catch (mediaError) {
          // Fallback to light
          initialTheme = 'light'
        }
      }
      
      setTheme(initialTheme)
      setMounted(true)
    } catch (error) {
      console.error('Error initializing theme:', error)
      setTheme('light')
      setMounted(true)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    try {
      localStorage.setItem('theme', theme)
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      // Still try to set the attribute even if localStorage fails
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

