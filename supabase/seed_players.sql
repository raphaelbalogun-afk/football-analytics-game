-- ============================================
-- Seed Players Data
-- ============================================
-- Mock EPL player data for demo purposes
-- ============================================

INSERT INTO public.players (
    name, team, position, base_price, current_price, price_cap, price_floor, 
    total_shares, available_shares
) VALUES
    -- Forwards
    ('Erling Haaland', 'Manchester City', 'FWD', 55.00, 55.00, 110.00, 27.50, 1000, 1000),
    ('Mohamed Salah', 'Liverpool', 'FWD', 48.00, 48.00, 96.00, 24.00, 1000, 1000),
    ('Harry Kane', 'Tottenham', 'FWD', 45.00, 45.00, 90.00, 22.50, 1000, 1000),
    ('Bukayo Saka', 'Arsenal', 'FWD', 42.00, 42.00, 84.00, 21.00, 1000, 1000),
    ('Son Heung-min', 'Tottenham', 'FWD', 40.00, 40.00, 80.00, 20.00, 1000, 1000),
    ('Ollie Watkins', 'Aston Villa', 'FWD', 35.00, 35.00, 70.00, 17.50, 1000, 1000),
    
    -- Midfielders
    ('Kevin De Bruyne', 'Manchester City', 'MID', 50.00, 50.00, 100.00, 25.00, 1000, 1000),
    ('Bruno Fernandes', 'Manchester United', 'MID', 44.00, 44.00, 88.00, 22.00, 1000, 1000),
    ('Martin Ødegaard', 'Arsenal', 'MID', 38.00, 38.00, 76.00, 19.00, 1000, 1000),
    ('Declan Rice', 'Arsenal', 'MID', 36.00, 36.00, 72.00, 18.00, 1000, 1000),
    ('Phil Foden', 'Manchester City', 'MID', 40.00, 40.00, 80.00, 20.00, 1000, 1000),
    ('Cole Palmer', 'Chelsea', 'MID', 32.00, 32.00, 64.00, 16.00, 1000, 1000),
    
    -- Defenders
    ('Virgil van Dijk', 'Liverpool', 'DEF', 32.00, 32.00, 64.00, 16.00, 1000, 1000),
    ('William Saliba', 'Arsenal', 'DEF', 30.00, 30.00, 60.00, 15.00, 1000, 1000),
    ('Ruben Dias', 'Manchester City', 'DEF', 31.00, 31.00, 62.00, 15.50, 1000, 1000),
    ('John Stones', 'Manchester City', 'DEF', 28.00, 28.00, 56.00, 14.00, 1000, 1000),
    ('Kieran Trippier', 'Newcastle United', 'DEF', 26.00, 26.00, 52.00, 13.00, 1000, 1000),
    
    -- Goalkeepers
    ('Alisson', 'Liverpool', 'GK', 28.00, 28.00, 56.00, 14.00, 1000, 1000),
    ('Ederson', 'Manchester City', 'GK', 27.00, 27.00, 54.00, 13.50, 1000, 1000),
    ('David Raya', 'Arsenal', 'GK', 25.00, 25.00, 50.00, 12.50, 1000, 1000);

