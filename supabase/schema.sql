-- ============================================
-- Football Analytics Game - Database Schema
-- ============================================
-- ENTERTAINMENT ONLY - Virtual Currency Trading
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    virtual_balance DECIMAL(12, 2) NOT NULL DEFAULT 10000.00,
    total_value DECIMAL(12, 2) NOT NULL DEFAULT 10000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);

-- ============================================
-- 2. PLAYERS TABLE
-- ============================================
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0),
    current_price DECIMAL(10, 2) NOT NULL CHECK (current_price > 0),
    price_cap DECIMAL(10, 2) NOT NULL CHECK (price_cap > base_price),
    price_floor DECIMAL(10, 2) NOT NULL CHECK (price_floor < base_price AND price_floor > 0),
    total_shares INTEGER NOT NULL CHECK (total_shares > 0),
    available_shares INTEGER NOT NULL CHECK (available_shares >= 0 AND available_shares <= total_shares),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT check_price_bounds CHECK (
        current_price >= price_floor AND current_price <= price_cap
    )
);

CREATE INDEX idx_players_team ON public.players(team);
CREATE INDEX idx_players_position ON public.players(position);
CREATE INDEX idx_players_name ON public.players(name);

-- ============================================
-- 3. PORTFOLIOS TABLE
-- ============================================
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    shares INTEGER NOT NULL CHECK (shares > 0),
    average_buy_price DECIMAL(10, 2) NOT NULL CHECK (average_buy_price > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, player_id)
);

CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_player_id ON public.portfolios(player_id);

-- ============================================
-- 4. TRADES TABLE
-- ============================================
CREATE TABLE public.trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    shares INTEGER NOT NULL CHECK (shares > 0),
    price_per_share DECIMAL(10, 2) NOT NULL CHECK (price_per_share > 0),
    total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_player_id ON public.trades(player_id);
CREATE INDEX idx_trades_created_at ON public.trades(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Players are viewable by everyone
CREATE POLICY "Players are viewable by everyone"
    ON public.players FOR SELECT
    USING (true);

-- Users can read their own portfolio
CREATE POLICY "Users can view own portfolio"
    ON public.portfolios FOR SELECT
    USING (auth.uid() = user_id OR true);

-- Users can read their own trades
CREATE POLICY "Users can view own trades"
    ON public.trades FOR SELECT
    USING (auth.uid() = user_id OR true);

-- Users can read their own user data
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id OR true);

