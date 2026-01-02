# API-Football Integration Guide

## Overview

Your project is now integrated with API-Football to fetch live data for:
- ✅ All players (EPL)
- ✅ All leagues
- ✅ League standings/tables
- ✅ Player statistics

## Configuration

Your API key has been added to `.env.local`:
```
API_FOOTBALL_KEY=50fffba51340e0b4987bba113fc2d0e9
```

## API Endpoints Created

### 1. Sync Players
**POST** `/api/sync/players`
- Fetches all EPL players from API-Football
- Updates Supabase database
- Transforms API data to your schema

### 2. Get Leagues
**GET** `/api/leagues`
- Returns all leagues (EPL focus)
- Live data from API-Football

### 3. Get Standings/Table
**GET** `/api/standings?league=39&season=2024`
- Returns league table/standings
- Query params:
  - `league`: League ID (39 = EPL)
  - `season`: Season year (default: 2024)

### 4. Get Player Statistics
**GET** `/api/players/stats?player=123` or `?team=50`
- Returns player statistics
- Query params:
  - `player`: Player ID (for specific player)
  - `team`: Team ID (for all team players)
  - `season`: Season year (default: 2024)

### 5. Get Players (Updated)
**GET** `/api/players?sync=true`
- Returns players from Supabase
- If `sync=true`, syncs from API-Football first

## How to Use

### Initial Sync (One-Time Setup)

1. **Sync all players to database:**
   ```bash
   # Option 1: Use API endpoint
   POST http://localhost:3000/api/sync/players
   
   # Option 2: Use script (if tsx is installed)
   npx tsx scripts/sync-all-data.ts
   ```

2. **Verify sync:**
   - Check Supabase Table Editor → `players` table
   - Should have hundreds of EPL players

### Regular Updates

**Option 1: Manual Sync**
- Call `POST /api/sync/players` when you want to update
- Can be triggered from admin panel or cron job

**Option 2: Auto-Sync on Page Load**
- Add `?sync=true` to `/api/players` calls
- Syncs automatically (slower but always fresh)

**Option 3: Scheduled Sync**
- Set up cron job or scheduled function
- Call sync endpoint periodically

## Data Flow

```
API-Football (Live Data)
    ↓
Sync Script (/api/sync/players)
    ↓
Transform & Calculate Prices
    ↓
Supabase Database (players table)
    ↓
API Routes (/api/players, /api/standings, etc.)
    ↓
Frontend Components
```

## API Rate Limits

API-Football has rate limits:
- **Free tier**: ~10 requests/minute
- **Paid tiers**: Higher limits

The sync script includes rate limiting (1 second delay between teams).

## Example Usage

### Sync Players
```bash
curl -X POST http://localhost:3000/api/sync/players
```

### Get League Table
```bash
curl http://localhost:3000/api/standings?league=39&season=2024
```

### Get Player Stats
```bash
curl http://localhost:3000/api/players/stats?player=276
```

### Get All Leagues
```bash
curl http://localhost:3000/api/leagues
```

## Price Calculation

Player prices are calculated from:
- Goals scored
- Assists
- Player rating
- Age (younger = higher potential)
- Position premium (FWD > MID > DEF > GK)

Prices update when you sync from API-Football.

## Troubleshooting

### "API-Football error: 429"
- Rate limit exceeded
- Wait a minute and try again
- Consider upgrading API plan

### "No players synced"
- Check API key is correct
- Verify API-Football account is active
- Check network connection

### "Empty response"
- API-Football may be down
- Check API status
- Verify league/season parameters

## Next Steps

1. **Run initial sync**: `POST /api/sync/players`
2. **Verify data**: Check Supabase `players` table
3. **Test endpoints**: Try `/api/standings`, `/api/leagues`
4. **Set up auto-sync**: Schedule periodic updates

Your project now has live data from API-Football! 🎉

