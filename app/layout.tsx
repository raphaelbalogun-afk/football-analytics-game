import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Football Analytics Game - Demo',
  description: 'ENTERTAINMENT ONLY - Simulated trading game with virtual currency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

