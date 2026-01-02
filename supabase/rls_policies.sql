-- ============================================
-- Row Level Security Policies
-- ============================================
-- Allow public access to players table for syncing
-- ============================================

-- Enable RLS on players table
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read players
CREATE POLICY "Allow public read access to players"
ON public.players
FOR SELECT
TO public
USING (true);

-- Policy: Allow anyone to insert players (for syncing)
CREATE POLICY "Allow public insert access to players"
ON public.players
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow anyone to update players (for syncing)
CREATE POLICY "Allow public update access to players"
ON public.players
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy: Allow anyone to delete players (for cleanup)
CREATE POLICY "Allow public delete access to players"
ON public.players
FOR DELETE
TO public
USING (true);

