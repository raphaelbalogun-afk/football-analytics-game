# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `football-analytics-game` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier works fine for demo
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. You'll find:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

Copy both values - you'll need them in the next step.

## Step 3: Configure Environment Variables

1. In your project root (`c:\football-analytics-game`), create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your actual anon/public key

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from your project
4. Copy and paste the entire contents into the SQL Editor
5. Click **"Run"** (or press F5)
6. Wait for "Success. No rows returned" message

This creates all the necessary tables:
- `users`
- `players`
- `portfolios`
- `trades`
- `player_prices`
- `leaderboard_entries` (view)

## Step 5: Seed Player Data (Optional but Recommended)

1. Still in **SQL Editor**, click **"New query"**
2. Open the file `supabase/seed_players.sql` from your project
3. Copy and paste the entire contents
4. Click **"Run"**
5. You should see a message showing 30 players inserted

## Step 6: Verify Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see:
   - `players` table with 30 rows
   - `users` table (empty initially)
   - Other tables for portfolios, trades, etc.

## Step 7: Test the API

1. Make sure your Next.js server is running: `npm.cmd run dev`
2. Open browser: `http://localhost:3000/api/players`
3. You should see JSON with player data

## Troubleshooting

### "Failed to fetch players" Error
- Check your `.env.local` file has correct credentials
- Make sure environment variable names start with `NEXT_PUBLIC_`
- Restart the dev server after changing `.env.local`

### "Relation does not exist" Error
- Make sure you ran `schema.sql` in SQL Editor
- Check that tables were created in Table Editor

### Empty Array `[]` Response
- Make sure you ran `seed_players.sql` to add player data
- Check `players` table in Table Editor has rows

### Connection Issues
- Verify your Supabase project is active (not paused)
- Check your internet connection
- Try refreshing your Supabase dashboard

## Quick Reference

**Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)
**SQL Editor Location**: Left sidebar → SQL Editor
**API Settings**: Settings → API
**Table Editor**: Left sidebar → Table Editor

## Next Steps

After Supabase is set up:
1. Restart your Next.js dev server
2. Test the API endpoint
3. Start using the application!

