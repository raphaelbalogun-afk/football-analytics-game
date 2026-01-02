# Data Source Clarification

## Current Setup

**Your project currently uses Supabase database** - NOT an external API-football server.

### How It Works Now:

1. **Players are stored in Supabase** (`players` table)
2. **API endpoint** (`/api/players`) fetches from Supabase database
3. **You seeded 17 players** using `seed_players.sql`

### Data Flow:

```
Supabase Database (players table)
    ↓
Next.js API Route (/api/players)
    ↓
Frontend Components
```

## If You Want External API Integration

If you want to integrate with an external API-football service (like API-Football, Football-Data.org), that would require:

1. **API Service Layer** - Code to fetch from external API
2. **Data Transformation** - Convert API response to your database format
3. **Sync Script** - Periodically update your database from the API
4. **API Keys** - Sign up for the external service

This is **beyond the MVP scope** but can be added later.

## Current Status

✅ Players are in Supabase database (from seed_players.sql)
✅ API endpoint fetches from Supabase
✅ No external API needed for MVP

## Testing Your Current Setup

1. **Check Supabase**: Go to Table Editor → `players` table should have 17 rows
2. **Test API**: `http://localhost:3000/api/players` should return JSON with players
3. **View in Browser**: `http://localhost:3000/market` should show player cards

## Next Steps

If you want external API integration, I can help you:
- Set up API-Football integration
- Create sync scripts
- Transform API data to your schema

But for now, your Supabase database is your data source!

