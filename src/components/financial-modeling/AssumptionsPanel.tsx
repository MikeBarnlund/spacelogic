'use client';

import { useState, useEffect } from 'react';
import { MarketRates, MarketOverrides, BuildingClass, BUILDING_CLASS_CONFIG } from '@/types/financial-model';
import { BROKERAGE_TIERS } from '@/lib/financial-modeling';

interface AssumptionsPanelProps {
  marketRates: MarketRates;
  buildingClass: BuildingClass;
  overrides: MarketOverrides | null;
  onOverridesChange: (overrides: MarketOverrides | null) => void;
  isSaving?: boolean;
}

export default function AssumptionsPanel({
  marketRates,
  buildingClass,
  overrides,
  onOverridesChange,
  isSaving,
}: AssumptionsPanelProps) {
  // Local state for editing
  const [localOverrides, setLocalOverrides] = useState<MarketOverrides>(overrides || {});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with external overrides
  useEffect(() => {
    setLocalOverrides(overrides || {});
    setHasChanges(false);
  }, [overrides]);

  const getEffectiveValue = (
    field: keyof MarketOverrides,
    defaultValue: number
  ): number => {
    return localOverrides[field] ?? defaultValue;
  };

  const handleChange = (field: keyof MarketOverrides, value: number | null) => {
    const newOverrides = { ...localOverrides };
    if (value === null) {
      delete newOverrides[field];
    } else {
      newOverrides[field] = value;
    }
    setLocalOverrides(newOverrides);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Only save non-empty overrides
    const cleanedOverrides = Object.keys(localOverrides).length > 0 ? localOverrides : null;
    onOverridesChange(cleanedOverrides);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalOverrides({});
    onOverridesChange(null);
    setHasChanges(false);
  };

  const getBaseRentField = (): keyof MarketOverrides => {
    switch (buildingClass) {
      case 'A': return 'class_a_rent';
      case 'B': return 'class_b_rent';
      case 'C': return 'class_c_rent';
    }
  };

  const getBaseRentDefault = (): number => {
    switch (buildingClass) {
      case 'A': return marketRates.class_a_rent;
      case 'B': return marketRates.class_b_rent;
      case 'C': return marketRates.class_c_rent;
    }
  };

  const baseRentField = getBaseRentField();
  const baseRentDefault = getBaseRentDefault();

  const hasOverrides = Object.keys(overrides || {}).length > 0;

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)]">
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Market Assumptions
        </span>
        {hasOverrides && (
          <span className="text-[10px] text-[var(--warning)] bg-[var(--warning-muted)] px-1.5 py-0.5 rounded">
            Customized
          </span>
        )}
      </div>

      <div className="p-3 space-y-3 bg-[var(--bg-primary)] border-t border-[var(--border)]">
        {/* Base Rent */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[var(--text-secondary)]">Base Rent</div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {BUILDING_CLASS_CONFIG[buildingClass].label} in {marketRates.market_name}
            </div>
          </div>
          <div className="flex items-center gap-1 w-[140px] justify-end">
            <span className="text-xs text-[var(--text-muted)] w-3 text-right">$</span>
            <input
              type="number"
              step="0.01"
              value={getEffectiveValue(baseRentField, baseRentDefault)}
              onChange={(e) => handleChange(baseRentField, parseFloat(e.target.value) || null)}
              className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
            />
            <span className="text-xs text-[var(--text-muted)] w-12">/sqft/yr</span>
          </div>
        </div>

        {/* Operating Costs */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[var(--text-secondary)]">Operating Costs</div>
            <div className="text-xs text-[var(--text-muted)]">Additional expenses</div>
          </div>
          <div className="flex items-center gap-1 w-[140px] justify-end">
            <span className="text-xs text-[var(--text-muted)] w-3 text-right">$</span>
            <input
              type="number"
              step="0.01"
              value={getEffectiveValue('operating_costs', marketRates.operating_costs)}
              onChange={(e) => handleChange('operating_costs', parseFloat(e.target.value) || null)}
              className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
            />
            <span className="text-xs text-[var(--text-muted)] w-12">/sqft/yr</span>
          </div>
        </div>

        {/* Annual Escalation */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[var(--text-secondary)]">Annual Escalation</div>
            <div className="text-xs text-[var(--text-muted)]">Yearly rent increase</div>
          </div>
          <div className="flex items-center gap-1 w-[140px] justify-end">
            <span className="text-xs text-[var(--text-muted)] w-3"></span>
            <input
              type="number"
              step="0.1"
              value={(getEffectiveValue('escalation_rate', marketRates.escalation_rate) * 100).toFixed(1)}
              onChange={(e) => handleChange('escalation_rate', (parseFloat(e.target.value) || 0) / 100)}
              className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
            />
            <span className="text-xs text-[var(--text-muted)] w-12">%</span>
          </div>
        </div>

        {/* TI Credit */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[var(--text-secondary)]">TI Credit</div>
            <div className="text-xs text-[var(--text-muted)]">Landlord contribution</div>
          </div>
          <div className="flex items-center gap-1 w-[140px] justify-end">
            <span className="text-xs text-[var(--text-muted)] w-3 text-right">$</span>
            <input
              type="number"
              step="1"
              value={getEffectiveValue('ti_credit_per_sqft', marketRates.ti_credit_per_sqft)}
              onChange={(e) => handleChange('ti_credit_per_sqft', parseFloat(e.target.value) || null)}
              className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
            />
            <span className="text-xs text-[var(--text-muted)] w-12">/sqft</span>
          </div>
        </div>

        {/* Rent-Free Period */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[var(--text-secondary)]">Rent-Free Period</div>
            <div className="text-xs text-[var(--text-muted)]">Initial free rent</div>
          </div>
          <div className="flex items-center gap-1 w-[140px] justify-end">
            <span className="text-xs text-[var(--text-muted)] w-3"></span>
            <input
              type="number"
              step="1"
              min="0"
              max="24"
              value={getEffectiveValue('rent_free_months', marketRates.rent_free_months)}
              onChange={(e) => handleChange('rent_free_months', parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
            />
            <span className="text-xs text-[var(--text-muted)] w-12">months</span>
          </div>
        </div>

        {/* Tiered Brokerage Rates */}
        <div className="pt-2 border-t border-[var(--border)]">
          <div className="text-sm text-[var(--text-secondary)] mb-2">Brokerage Fee</div>
          <div className="text-xs text-[var(--text-muted)] mb-3">Tiered % of lease value by year</div>
          <div className="space-y-2">
            {/* Years 1-5 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-muted)]">Years 1-5</div>
              </div>
              <div className="flex items-center gap-1 w-[140px] justify-end">
                <span className="text-xs text-[var(--text-muted)] w-3"></span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={((getEffectiveValue('brokerage_rate_years_1_5', BROKERAGE_TIERS[0].rate) as number) * 100).toFixed(1)}
                  onChange={(e) => handleChange('brokerage_rate_years_1_5', (parseFloat(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
                />
                <span className="text-xs text-[var(--text-muted)] w-12">%</span>
              </div>
            </div>

            {/* Years 6-10 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-muted)]">Years 6-10</div>
              </div>
              <div className="flex items-center gap-1 w-[140px] justify-end">
                <span className="text-xs text-[var(--text-muted)] w-3"></span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={((getEffectiveValue('brokerage_rate_years_6_10', BROKERAGE_TIERS[1].rate) as number) * 100).toFixed(1)}
                  onChange={(e) => handleChange('brokerage_rate_years_6_10', (parseFloat(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
                />
                <span className="text-xs text-[var(--text-muted)] w-12">%</span>
              </div>
            </div>

            {/* Years 11+ */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-muted)]">Years 11+</div>
              </div>
              <div className="flex items-center gap-1 w-[140px] justify-end">
                <span className="text-xs text-[var(--text-muted)] w-3"></span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={((getEffectiveValue('brokerage_rate_years_11_plus', BROKERAGE_TIERS[2].rate) as number) * 100).toFixed(1)}
                  onChange={(e) => handleChange('brokerage_rate_years_11_plus', (parseFloat(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 text-sm font-medium text-right bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)]"
                />
                <span className="text-xs text-[var(--text-muted)] w-12">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-2 px-3 text-xs font-medium rounded bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          {(hasOverrides || hasChanges) && (
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="py-2 px-3 text-xs font-medium rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50"
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
