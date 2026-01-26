'use client';

import { useState } from 'react';
import { MarketRates, BuildingClass, BUILDING_CLASS_CONFIG } from '@/types/financial-model';

interface AssumptionsPanelProps {
  marketRates: MarketRates;
  buildingClass: BuildingClass;
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function AssumptionsPanel({ marketRates, buildingClass }: AssumptionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBaseRent = () => {
    switch (buildingClass) {
      case 'A':
        return marketRates.class_a_rent;
      case 'B':
        return marketRates.class_b_rent;
      case 'C':
        return marketRates.class_c_rent;
    }
  };

  const assumptions = [
    {
      label: 'Base Rent',
      value: `${formatCurrency(getBaseRent())}/sqft/year`,
      description: `${BUILDING_CLASS_CONFIG[buildingClass].label} in ${marketRates.market_name}`,
    },
    {
      label: 'Operating Costs',
      value: `${formatCurrency(marketRates.operating_costs)}/sqft/year`,
      description: 'Additional operating expenses',
    },
    {
      label: 'Annual Escalation',
      value: formatPercent(marketRates.escalation_rate),
      description: 'Yearly rent increase',
    },
    {
      label: 'TI Credit',
      value: `${formatCurrency(marketRates.ti_credit_per_sqft)}/sqft`,
      description: 'Landlord contribution',
    },
    {
      label: 'Rent-Free Period',
      value: `${marketRates.rent_free_months} months`,
      description: 'Initial free rent',
    },
    {
      label: 'Brokerage Fee',
      value: formatPercent(marketRates.brokerage_rate),
      description: '% of total lease value',
    },
  ];

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Market Assumptions
        </span>
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-3 space-y-3 bg-[var(--bg-primary)] border-t border-[var(--border)]">
          {assumptions.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--text-secondary)]">{item.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{item.description}</div>
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
