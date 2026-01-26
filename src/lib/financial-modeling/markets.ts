import { MarketRates } from '@/types/financial-model';

// Canadian market base rents and defaults
// Data represents typical market conditions for office leases

// Note: Brokerage uses standardized tiered rates (5%/3%/2%) - see BROKERAGE_TIERS in calculator.ts
export const CANADIAN_MARKETS: MarketRates[] = [
  {
    market_key: 'toronto',
    market_name: 'Toronto',
    class_a_rent: 65.00,
    class_b_rent: 45.00,
    class_c_rent: 32.00,
    operating_costs: 22.00,
    escalation_rate: 0.03,
    ti_credit_per_sqft: 50.00,
    rent_free_months: 6,
  },
  {
    market_key: 'vancouver',
    market_name: 'Vancouver',
    class_a_rent: 58.00,
    class_b_rent: 42.00,
    class_c_rent: 30.00,
    operating_costs: 20.00,
    escalation_rate: 0.03,
    ti_credit_per_sqft: 45.00,
    rent_free_months: 4,
  },
  {
    market_key: 'calgary',
    market_name: 'Calgary',
    class_a_rent: 38.00,
    class_b_rent: 28.00,
    class_c_rent: 20.00,
    operating_costs: 15.00,
    escalation_rate: 0.025,
    ti_credit_per_sqft: 40.00,
    rent_free_months: 6,
  },
  {
    market_key: 'montreal',
    market_name: 'Montreal',
    class_a_rent: 42.00,
    class_b_rent: 32.00,
    class_c_rent: 24.00,
    operating_costs: 18.00,
    escalation_rate: 0.03,
    ti_credit_per_sqft: 35.00,
    rent_free_months: 4,
  },
  {
    market_key: 'ottawa',
    market_name: 'Ottawa',
    class_a_rent: 35.00,
    class_b_rent: 28.00,
    class_c_rent: 22.00,
    operating_costs: 16.00,
    escalation_rate: 0.025,
    ti_credit_per_sqft: 30.00,
    rent_free_months: 3,
  },
] as const;

// Create a map for quick lookup by market_key
export const MARKETS_BY_KEY: Record<string, MarketRates> = CANADIAN_MARKETS.reduce(
  (acc, market) => {
    acc[market.market_key] = market;
    return acc;
  },
  {} as Record<string, MarketRates>
);

// Get market by key with fallback to Toronto
export function getMarketRates(marketKey: string): MarketRates {
  return MARKETS_BY_KEY[marketKey] || MARKETS_BY_KEY['toronto'];
}

// Get all market options for dropdown
export function getAllMarkets(): Array<{ key: string; name: string }> {
  return CANADIAN_MARKETS.map(m => ({
    key: m.market_key,
    name: m.market_name,
  }));
}

// Try to match a location string to a market key
export function matchLocationToMarket(location: string | null): string {
  if (!location) return 'toronto';

  const locationLower = location.toLowerCase();

  for (const market of CANADIAN_MARKETS) {
    if (locationLower.includes(market.market_key)) {
      return market.market_key;
    }
    // Also check market name
    if (locationLower.includes(market.market_name.toLowerCase())) {
      return market.market_key;
    }
  }

  // Check for common variations
  if (locationLower.includes('gta') || locationLower.includes('greater toronto')) {
    return 'toronto';
  }
  if (locationLower.includes('gva') || locationLower.includes('greater vancouver')) {
    return 'vancouver';
  }

  // Default to Toronto
  return 'toronto';
}
