# Deployment Checklist

## Before Deploying

- [x] Filter components created (PlayerFilters, LeagueFilters, StatsFilters)
- [x] Pages updated with filters (Market, Standings, Statistics)
- [x] API-Football integration complete
- [x] Sync endpoint created
- [x] Error handling improved
- [ ] **RLS policies applied in Supabase** ⚠️ REQUIRED
- [ ] Environment variables ready for Vercel

## Critical: RLS Policies

**MUST RUN THIS BEFORE SYNC WILL WORK:**

1. Go to: https://msmpesahgevguiizimsi.supabase.co
2. SQL Editor → New Query
3. Copy contents of `supabase/rls_policies.sql`
4. Run the query
5. Verify policies are created

## Files Ready for Deployment

- ✅ All filter components
- ✅ Updated API routes
- ✅ Sync functionality
- ✅ Error handling
- ✅ Test endpoints (can be removed in production)

## Next Steps

1. Run RLS policies SQL
2. Test sync locally: `POST http://localhost:3000/api/sync/players`
3. Verify players are in database
4. Deploy to Vercel
5. Set environment variables
6. Test sync on production
7. Verify all pages work

