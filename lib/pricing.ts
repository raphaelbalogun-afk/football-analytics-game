/**
 * Pricing Engine
 * 
 * Simple pricing logic with caps:
 * - Price increases when shares are bought
 * - Price decreases when shares are sold
 * - Price is capped between price_floor and price_cap
 */

export interface PriceUpdate {
  newPrice: number
  priceChange: number
}

/**
 * Calculate new price when shares are bought
 * Price increases based on percentage of total shares bought
 */
export function calculateBuyPrice(
  currentPrice: number,
  sharesToBuy: number,
  totalShares: number,
  priceCap: number
): PriceUpdate {
  // Simple linear increase: price goes up by 1% per 10% of total shares bought
  const sharePercentage = (sharesToBuy / totalShares) * 100
  const priceIncreasePercent = (sharePercentage / 10) * 0.01 // 1% per 10% of shares
  
  const priceIncrease = currentPrice * priceIncreasePercent
  let newPrice = currentPrice + priceIncrease
  
  // Cap at maximum
  newPrice = Math.min(newPrice, priceCap)
  
  return {
    newPrice,
    priceChange: newPrice - currentPrice
  }
}

/**
 * Calculate new price when shares are sold
 * Price decreases based on percentage of total shares sold
 */
export function calculateSellPrice(
  currentPrice: number,
  sharesToSell: number,
  totalShares: number,
  priceFloor: number
): PriceUpdate {
  // Simple linear decrease: price goes down by 1% per 10% of total shares sold
  const sharePercentage = (sharesToSell / totalShares) * 100
  const priceDecreasePercent = (sharePercentage / 10) * 0.01 // 1% per 10% of shares
  
  const priceDecrease = currentPrice * priceDecreasePercent
  let newPrice = currentPrice - priceDecrease
  
  // Floor at minimum
  newPrice = Math.max(newPrice, priceFloor)
  
  return {
    newPrice,
    priceChange: newPrice - currentPrice
  }
}

/**
 * Calculate total cost/revenue for a trade
 */
export function calculateTotalCost(shares: number, pricePerShare: number): number {
  return shares * pricePerShare
}

