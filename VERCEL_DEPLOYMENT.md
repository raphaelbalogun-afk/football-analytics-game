# Vercel Deployment Guide

## Prerequisites

1. **Supabase RLS Policies**: Before deploying, make sure you've run the RLS policies SQL script:
   - Go to your Supabase project: https://msmpesahgevguiizimsi.supabase.co
   - Open SQL Editor
   - Run the contents of `supabase/rls_policies.sql`

2. **Environment Variables**: You'll need to set these in Vercel:

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Add filter components and API-Football integration"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
cd football-analytics-game
vercel
```

## Step 3: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://msmpesahgevguiizimsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbXBlc2FoZ2V2Z3VpaXppbXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDY1ODIsImV4cCI6MjA4MjcyMjU4Mn0.e0NbT1tmMs2402-aM8UBDYeifK4-fawKnX5OPbd_MAI
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
API_FOOTBALL_KEY=50fffba51340e0b4987bba113fc2d0e9
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

**Important**: Replace `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL after the first deployment.

## Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Step 5: Sync Players

After deployment, trigger the player sync:

```bash
# Via API
curl -X POST https://your-app.vercel.app/api/sync/players

# Or visit in browser
https://your-app.vercel.app/api/sync/players
```

## Troubleshooting

### Build Errors

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### Runtime Errors

- Verify environment variables are set correctly
- Check Vercel function logs for errors
- Ensure RLS policies are applied in Supabase

### API-Football Rate Limits

- Free tier: 10 requests/minute
- The sync function includes rate limiting
- For large syncs, you may need to run multiple times

## Post-Deployment Checklist

- [ ] RLS policies applied in Supabase
- [ ] Environment variables set in Vercel
- [ ] Build completes successfully
- [ ] App loads at Vercel URL
- [ ] Player sync endpoint works
- [ ] Market page displays players
- [ ] Filters work on all pages
- [ ] Standings page loads league data
- [ ] Statistics page displays player stats

