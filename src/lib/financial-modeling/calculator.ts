import {
  BuildingClass,
  FinancialInputs,
  FinancialModel,
  MarketRates,
  MarketOverrides,
  TI_COST_PER_SQFT,
  YearlyCashFlow,
} from '@/types/financial-model';

/**
 * Default tiered brokerage rates by lease year
 * Years 1-5: 5%, Years 6-10: 3%, Years 11+: 2%
 */
export const BROKERAGE_TIERS = [
  { startYear: 1, endYear: 5, rate: 0.05 },
  { startYear: 6, endYear: 10, rate: 0.03 },
  { startYear: 11, endYear: Infinity, rate: 0.02 },
] as const;

/**
 * Get brokerage tiers with any overrides applied
 */
export function getBrokerageTiers(overrides?: MarketOverrides | null) {
  return [
    { startYear: 1, endYear: 5, rate: overrides?.brokerage_rate_years_1_5 ?? BROKERAGE_TIERS[0].rate },
    { startYear: 6, endYear: 10, rate: overrides?.brokerage_rate_years_6_10 ?? BROKERAGE_TIERS[1].rate },
    { startYear: 11, endYear: Infinity, rate: overrides?.brokerage_rate_years_11_plus ?? BROKERAGE_TIERS[2].rate },
  ];
}

/**
 * Calculate brokerage fee using tiered rates
 * Default: Years 1-5: 5%, Years 6-10: 3%, Years 11+: 2%
 */
export function calculateTieredBrokerage(
  sqft: number,
  baseRentPerSqft: number,
  operatingCosts: number,
  escalationRate: number,
  leaseTerm: number,
  overrides?: MarketOverrides | null
): { totalBrokerage: number; blendedRate: number } {
  let totalBrokerage = 0;
  let totalLeaseValue = 0;
  let currentRent = baseRentPerSqft;
  let currentOps = operatingCosts;

  const tiers = getBrokerageTiers(overrides);

  for (let year = 1; year <= leaseTerm; year++) {
    const yearValue = sqft * (currentRent + currentOps);
    totalLeaseValue += yearValue;

    // Find the applicable tier for this year
    const tier = tiers.find(
      (t) => year >= t.startYear && year <= t.endYear
    );
    const rate = tier?.rate ?? 0.02;

    totalBrokerage += yearValue * rate;

    currentRent *= 1 + escalationRate;
    currentOps *= 1 + escalationRate;
  }

  const blendedRate = totalLeaseValue > 0 ? totalBrokerage / totalLeaseValue : 0;

  return { totalBrokerage, blendedRate };
}

/**
 * Merge default market rates with project-level overrides
 */
export function applyMarketOverrides(
  marketRates: MarketRates,
  overrides: MarketOverrides | null | undefined
): MarketRates {
  if (!overrides) return marketRates;

  return {
    ...marketRates,
    class_a_rent: overrides.class_a_rent ?? marketRates.class_a_rent,
    class_b_rent: overrides.class_b_rent ?? marketRates.class_b_rent,
    class_c_rent: overrides.class_c_rent ?? marketRates.class_c_rent,
    operating_costs: overrides.operating_costs ?? marketRates.operating_costs,
    escalation_rate: overrides.escalation_rate ?? marketRates.escalation_rate,
    ti_credit_per_sqft: overrides.ti_credit_per_sqft ?? marketRates.ti_credit_per_sqft,
    rent_free_months: overrides.rent_free_months ?? marketRates.rent_free_months,
  };
}

/**
 * Get the base rent per sqft for a given market and building class
 */
export function getBaseRent(
  marketRates: MarketRates,
  buildingClass: BuildingClass
): number {
  switch (buildingClass) {
    case 'A':
      return marketRates.class_a_rent;
    case 'B':
      return marketRates.class_b_rent;
    case 'C':
      return marketRates.class_c_rent;
    default:
      return marketRates.class_b_rent;
  }
}

/**
 * Calculate the total lease value for brokerage fee calculation
 */
export function calculateTotalLeaseValue(
  sqft: number,
  baseRentPerSqft: number,
  operatingCosts: number,
  escalationRate: number,
  leaseTerm: number
): number {
  let total = 0;
  let currentRent = baseRentPerSqft;
  let currentOps = operatingCosts;

  for (let year = 1; year <= leaseTerm; year++) {
    total += sqft * (currentRent + currentOps);
    currentRent *= 1 + escalationRate;
    currentOps *= 1 + escalationRate;
  }

  return total;
}

/**
 * Calculate the complete financial model for a scenario
 */
export function calculateFinancialModel(
  sqft: number,
  inputs: FinancialInputs,
  marketRates: MarketRates,
  overrides?: MarketOverrides | null
): FinancialModel {
  const baseRentPerSqft = getBaseRent(marketRates, inputs.building_class);
  const tiCostPerSqft = TI_COST_PER_SQFT[inputs.ti_level];

  // Calculate tiered brokerage fee (pass overrides for custom rates)
  const { totalBrokerage: brokerage } = calculateTieredBrokerage(
    sqft,
    baseRentPerSqft,
    marketRates.operating_costs,
    marketRates.escalation_rate,
    inputs.lease_term,
    overrides
  );

  // One-time costs in Year 1
  const tiCosts = sqft * tiCostPerSqft;
  const tiCredit = sqft * marketRates.ti_credit_per_sqft;

  const yearlyCashFlows: YearlyCashFlow[] = [];
  let cumulative = 0;
  let currentBaseRent = baseRentPerSqft;
  let currentOpCosts = marketRates.operating_costs;

  for (let year = 1; year <= inputs.lease_term; year++) {
    // Year 1 adjustments for rent-free period
    const rentFreeAdjustment =
      year === 1 ? (12 - marketRates.rent_free_months) / 12 : 1;

    const yearBaseRent = sqft * currentBaseRent * rentFreeAdjustment;
    const yearOpCosts = sqft * currentOpCosts;
    const yearTiCosts = year === 1 ? tiCosts : 0;
    const yearTiCredit = year === 1 ? -tiCredit : 0;
    const yearBrokerage = year === 1 ? brokerage : 0;

    const yearTotal =
      yearBaseRent + yearOpCosts + yearTiCosts + yearTiCredit + yearBrokerage;
    cumulative += yearTotal;

    yearlyCashFlows.push({
      year,
      base_rent: Math.round(yearBaseRent),
      operating_costs: Math.round(yearOpCosts),
      ti_costs: Math.round(yearTiCosts),
      ti_credit: Math.round(yearTiCredit),
      brokerage: Math.round(yearBrokerage),
      total: Math.round(yearTotal),
      cumulative: Math.round(cumulative),
    });

    // Apply escalation for next year
    currentBaseRent *= 1 + marketRates.escalation_rate;
    currentOpCosts *= 1 + marketRates.escalation_rate;
  }

  const totalCost = cumulative;
  const effectiveAnnualCost = totalCost / inputs.lease_term;
  const costPerSqftPerYear = effectiveAnnualCost / sqft;

  return {
    inputs,
    sqft,
    yearly_cash_flows: yearlyCashFlows,
    total_cost: Math.round(totalCost),
    effective_annual_cost: Math.round(effectiveAnnualCost),
    cost_per_sqft_per_year: Math.round(costPerSqftPerYear * 100) / 100,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format currency with full precision
 */
export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Calculate comparison metrics between scenarios
 */
export function calculateComparison(
  models: FinancialModel[]
): Array<{
  sqft: number;
  total_cost: number;
  annual_cost: number;
  cost_per_sqft: number;
  savings_vs_highest: number;
  savings_percentage: number;
}> {
  if (models.length === 0) return [];

  const maxCost = Math.max(...models.map((m) => m.total_cost));

  return models.map((model) => ({
    sqft: model.sqft,
    total_cost: model.total_cost,
    annual_cost: model.effective_annual_cost,
    cost_per_sqft: model.cost_per_sqft_per_year,
    savings_vs_highest: maxCost - model.total_cost,
    savings_percentage:
      maxCost > 0 ? ((maxCost - model.total_cost) / maxCost) * 100 : 0,
  }));
}
