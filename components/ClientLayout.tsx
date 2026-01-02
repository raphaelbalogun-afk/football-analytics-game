'use client'

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
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ThemeToggle />
    </>
  )
}

