import { WorkstylePreset } from './kit-of-parts';

// Building class determines base rent rates
export type BuildingClass = 'A' | 'B' | 'C';

// Tenant improvement level (uses existing COST_PER_SQFT values)
export type TILevel = 'low' | 'mid' | 'high';

// Lease term options in years
export type LeaseTerm = 5 | 10 | 15 | 20;

// Market rates for a specific city/market
// Note: Brokerage uses standardized tiered rates (5%/3%/2%) - see BROKERAGE_TIERS in calculator.ts
export interface MarketRates {
  market_key: string;
  market_name: string;
  class_a_rent: number;      // $/sqft/year for Class A
  class_b_rent: number;      // $/sqft/year for Class B
  class_c_rent: number;      // $/sqft/year for Class C
  operating_costs: number;    // $/sqft/year additional operating costs
  escalation_rate: number;    // Annual % increase (e.g., 0.03 for 3%)
  ti_credit_per_sqft: number; // Landlord TI contribution
  rent_free_months: number;   // Months of free rent at start
}

// Partial market rates for project-level overrides
export interface MarketOverrides {
  class_a_rent?: number;
  class_b_rent?: number;
  class_c_rent?: number;
  operating_costs?: number;
  escalation_rate?: number;
  ti_credit_per_sqft?: number;
  rent_free_months?: number;
  // Brokerage tier rates (as decimals, e.g., 0.05 for 5%)
  brokerage_rate_years_1_5?: number;
  brokerage_rate_years_6_10?: number;
  brokerage_rate_years_11_plus?: number;
}

// User inputs for financial modeling
export interface FinancialInputs {
  building_class: BuildingClass;
  lease_term: LeaseTerm;
  ti_level: TILevel;
  market_key: string;
}

// Cash flow for a single year
export interface YearlyCashFlow {
  year: number;
  base_rent: number;
  operating_costs: number;
  ti_costs: number;         // Only in Year 1
  ti_credit: number;        // Only in Year 1 (negative)
  brokerage: number;        // Only in Year 1
  total: number;            // Net total for this year
  cumulative: number;       // Running total through this year
}

// Complete financial model for a scenario
export interface FinancialModel {
  inputs: FinancialInputs;
  sqft: number;
  yearly_cash_flows: YearlyCashFlow[];
  total_cost: number;
  effective_annual_cost: number;
  cost_per_sqft_per_year: number;
}

// Financial model storage for a scenario
export interface ScenarioFinancials {
  scenario_type: WorkstylePreset;
  model: FinancialModel | null;
  last_updated: string;
}

// TI costs per sqft (matches existing COST_PER_SQFT pattern)
export const TI_COST_PER_SQFT: Record<TILevel, number> = {
  low: 120,   // Basic build-out
  mid: 250,   // Standard build-out
  high: 450,  // Premium build-out
} as const;

// Display labels for building classes
export const BUILDING_CLASS_CONFIG: Record<BuildingClass, { label: string; description: string }> = {
  A: { label: 'Class A', description: 'Premium, newest buildings' },
  B: { label: 'Class B', description: 'Good quality, older buildings' },
  C: { label: 'Class C', description: 'Functional, value-focused' },
} as const;

// Display labels for TI levels
export const TI_LEVEL_CONFIG: Record<TILevel, { label: string; description: string }> = {
  low: { label: 'Low', description: '$120/sqft - Basic build-out' },
  mid: { label: 'Mid', description: '$250/sqft - Standard build-out' },
  high: { label: 'High', description: '$450/sqft - Premium build-out' },
} as const;

// Lease term options
export const LEASE_TERMS: LeaseTerm[] = [5, 10, 15, 20] as const;
