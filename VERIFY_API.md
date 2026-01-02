# API Server Verification Guide

## Understanding the Architecture

This Next.js app has **built-in API routes** - they're not a separate server. The API runs as part of the Next.js application.

### API Endpoints

- `GET /api/players` - Returns all players from Supabase
- `GET /api/players/[id]` - Returns a single player
- `POST /api/trade` - Execute buy/sell trades
- `GET /api/portfolio?user_id=xxx` - Get user portfolio
- `GET /api/leaderboard` - Get rankings

### Data Source

**Players come from Supabase database**, not an external API. You need:
1. Supabase project set up
2. Database schema created (`supabase/schema.sql`)
3. Players seeded (`supabase/seed_players.sql`)
4. Environment variables configured (`.env.local`)

## Verification Steps

### Step 1: Check if Server is Running

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

Or open browser: `http://localhost:3000/api/players`

### Step 2: Start the Server (if not running)

```bash
cd football-analytics-game
npm install  # First time only
npm run dev
```

Wait for: `✓ Ready in X.Xs` message

### Step 3: Test the API

**Option A: Browser**
- Open: `http://localhost:3000/api/players`
- Should see JSON response with player data

**Option B: Command Line**
```bash
# Using curl (if installed)
curl http://localhost:3000/api/players

# Or using PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/players | Select-Object -ExpandProperty Content
```

**Option C: Verification Script**
```bash
node verify-api.js
```

### Step 4: Check Supabase Connection

The API needs:
- ✅ `.env.local` file with Supabase credentials
- ✅ Supabase project created
- ✅ Database schema deployed
- ✅ Players table has data

## Common Issues

### "ECONNREFUSED" Error
- Server is not running
- Solution: Run `npm run dev`

### Empty Array `[]` Response
- Database is empty or not connected
- Solution: Check Supabase connection and seed players

### "Failed to fetch players" Error
- Supabase credentials incorrect
- Solution: Verify `.env.local` file

### Port Already in Use
- Another process is using port 3000
- Solution: Kill the process or use different port: `npm run dev -- -p 3001`

## Expected Response

When working correctly, `/api/players` should return:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Erling Haaland",
      "team": "Manchester City",
      "position": "FWD",
      "current_price": 55.00,
      ...
    }
  ],
  "count": 30
}
```

## Quick Test Commands

```bash
# 1. Check if dependencies installed
Test-Path node_modules

# 2. Check if env file exists
Test-Path .env.local

# 3. Start server
npm run dev

# 4. In another terminal, test API
Invoke-WebRequest http://localhost:3000/api/players
```

