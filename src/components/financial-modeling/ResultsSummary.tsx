'use client';

import { FinancialModel } from '@/types/financial-model';

interface ResultsSummaryProps {
  model: FinancialModel;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function ResultsSummary({ model }: ResultsSummaryProps) {
  const year1 = model.yearly_cash_flows[0];

  // Calculate total TI costs over the lease
  const totalTiCosts = year1.ti_costs;
  const totalTiCredit = Math.abs(year1.ti_credit);
  const netTiCosts = totalTiCosts - totalTiCredit;

  return (
    <div className="space-y-6">
      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Cost */}
        <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)]">
          <div className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">
            Total Lease Cost
          </div>
          <div className="text-2xl font-semibold text-[var(--accent)] mono">
            {formatCurrency(model.total_cost)}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            Over {model.inputs.lease_term} years
          </div>
        </div>

        {/* Cost Per Sqft */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">
            Effective Rate
          </div>
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            ${model.cost_per_sqft_per_year}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            Per sqft/year
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-muted)] mb-1">Annual Cost</div>
          <div className="text-lg font-medium text-[var(--text-primary)] mono">
            {formatCurrency(model.effective_annual_cost)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-muted)] mb-1">Total Sqft</div>
          <div className="text-lg font-medium text-[var(--text-primary)] mono">
            {formatNumber(model.sqft)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div className="text-xs text-[var(--text-muted)] mb-1">Lease Term</div>
          <div className="text-lg font-medium text-[var(--text-primary)] mono">
            {model.inputs.lease_term} years
          </div>
        </div>
      </div>

      {/* Year 1 Breakdown */}
      <div>
        <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">
          Year 1 Breakdown
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#94a3b8]" />
              <span className="text-sm text-[var(--text-secondary)]">Base Rent</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] mono">
              {formatFullCurrency(year1.base_rent)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#64748b]" />
              <span className="text-sm text-[var(--text-secondary)]">Operating Costs</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] mono">
              {formatFullCurrency(year1.operating_costs)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span className="text-sm text-[var(--text-secondary)]">TI Costs</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] mono">
              {formatFullCurrency(year1.ti_costs)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-sm text-[var(--text-secondary)]">TI Credit</span>
            </div>
            <span className="text-sm font-medium text-[var(--success)] mono">
              {formatFullCurrency(year1.ti_credit)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#a78bfa]" />
              <span className="text-sm text-[var(--text-secondary)]">Brokerage Fee</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] mono">
              {formatFullCurrency(year1.brokerage)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--accent-muted)] border border-[var(--border-accent)]">
            <span className="text-sm font-medium text-[var(--accent)]">Year 1 Total</span>
            <span className="text-sm font-semibold text-[var(--accent)] mono">
              {formatFullCurrency(year1.total)}
            </span>
          </div>
        </div>
      </div>

      {/* TI Summary */}
      <div>
        <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">
          Tenant Improvement Summary
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">TI Costs (Build-out)</span>
            <span className="text-sm font-medium text-[var(--text-primary)] mono">
              {formatFullCurrency(totalTiCosts)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Landlord TI Credit</span>
            <span className="text-sm font-medium text-[var(--success)] mono">
              -{formatFullCurrency(totalTiCredit)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Net TI Cost</span>
            <span className="text-sm font-semibold text-[var(--text-primary)] mono">
              {formatFullCurrency(netTiCosts)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
