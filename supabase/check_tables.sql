-- ============================================
-- Check Existing Tables
-- ============================================
-- Run this to see what tables already exist
-- ============================================

SELECT 
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('users', 'players', 'portfolios', 'trades')
ORDER BY table_name;

