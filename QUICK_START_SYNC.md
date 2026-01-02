# Quick Start: Sync Live Data from API-Football

## Step 1: Restart Server (to load new environment variables)

The server needs to be restarted to pick up the API-Football key.

**Stop the current server** (if running):
- Press `Ctrl+C` in the server window, or
- Close the PowerShell window running the server

**Start the server again**:
```powershell
cd c:\football-analytics-game
npm.cmd run dev
```

Wait for: `✓ Ready in X.Xs`

## Step 2: Sync Players from API-Football

Once the server is running, sync players:

**Option A: Using PowerShell**
```powershell
Invoke-WebRequest -Method POST -Uri "http://localhost:3000/api/sync/players"
```

**Option B: Using Browser**
- Open: `http://localhost:3000/api/sync/players`
- Use a browser extension to make POST request, or
- Use the curl command below

**Option C: Using curl (if installed)**
```bash
curl -X POST http://localhost:3000/api/sync/players
```

## Step 3: Verify Sync

Check if players were synced:

1. **Check API response:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/api/players" | Select-Object -ExpandProperty Content
   ```

2. **Check Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Open `players` table
   - Should see hundreds of EPL players

## Step 4: Test Other Endpoints

### Get League Table
```
http://localhost:3000/api/standings?league=39&season=2024
```

### Get All Leagues
```
http://localhost:3000/api/leagues
```

### Get Player Stats
```
http://localhost:3000/api/players/stats?player=276
```

## Important Notes

⚠️ **Rate Limits**: API-Football free tier allows ~10 requests/minute
- The sync script includes delays to respect limits
- Initial sync may take 10-15 minutes for all teams

⚠️ **First Sync**: The first sync fetches ALL EPL players (hundreds)
- This may take time due to rate limiting
- Be patient - it's fetching live data!

⚠️ **Subsequent Syncs**: Much faster as it only updates existing players

## Troubleshooting

### "0 players synced"
- Check API key is correct in `.env.local`
- Verify server was restarted after adding API key
- Check API-Football account is active
- Look at server console for error messages

### "Rate limit exceeded"
- Wait 1 minute and try again
- The sync script already includes delays

### "Empty teams array"
- Check API-Football service status
- Verify league ID (39 = EPL) is correct
- Check network connection

## Expected Results

After successful sync:
- ✅ Hundreds of EPL players in Supabase
- ✅ Players with calculated prices based on stats
- ✅ All teams represented
- ✅ Live data from current season

Your market will now show real EPL players with live statistics! 🎉

