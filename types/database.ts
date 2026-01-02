/**
 * Database Type Definitions
 * 
 * TypeScript interfaces matching the Supabase database schema
 * Ensures type safety across the application
 */

export interface Player {
  id: string
  name: string
  team: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  base_price: number
  current_price: number
  price_cap: number
  price_floor: number
  total_shares: number
  available_shares: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  virtual_balance: number
  total_value: number
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  player_id: string
  shares: number
  average_buy_price: number
  created_at: string
  updated_at: string
}

export interface Trade {
  id: string
  user_id: string
  player_id: string
  type: 'buy' | 'sell'
  shares: number
  price_per_share: number
  total_amount: number
  created_at: string
}

