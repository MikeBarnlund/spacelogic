import {
  BuildingClass,
  FinancialInputs,
  FinancialModel,
  MarketRates,
  TI_COST_PER_SQFT,
  YearlyCashFlow,
} from '@/types/financial-model';

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
  marketRates: MarketRates
): FinancialModel {
  const baseRentPerSqft = getBaseRent(marketRates, inputs.building_class);
  const tiCostPerSqft = TI_COST_PER_SQFT[inputs.ti_level];

  // Calculate total lease value for brokerage
  const totalLeaseValue = calculateTotalLeaseValue(
    sqft,
    baseRentPerSqft,
    marketRates.operating_costs,
    marketRates.escalation_rate,
    inputs.lease_term
  );

  // One-time costs in Year 1
  const tiCosts = sqft * tiCostPerSqft;
  const tiCredit = sqft * marketRates.ti_credit_per_sqft;
  const brokerage = totalLeaseValue * marketRates.brokerage_rate;

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
