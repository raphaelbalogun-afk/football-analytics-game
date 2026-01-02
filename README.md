# Football Analytics Game (Demo)

**ENTERTAINMENT ONLY - NO REAL MONEY**

A simulated trading game for EPL players using virtual currency only.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Set up database:
   - Go to Supabase SQL Editor
   - Run the schema from `supabase/schema.sql`
   - Seed players from `supabase/seed_players.sql` (optional)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Player Market** - Browse and view EPL players
- **Trading** - Buy/sell virtual shares with price updates
- **Portfolio** - Track holdings and P&L
- **Leaderboard** - Rankings by total portfolio value

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth)
- React 18

## Disclaimer

This is a DEMO application for entertainment purposes only. All trading is simulated with virtual currency. No real money is involved. No cash-out functionality exists.

