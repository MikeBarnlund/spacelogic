'use client';

import {
  BuildingClass,
  LeaseTerm,
  TILevel,
  BUILDING_CLASS_CONFIG,
  TI_LEVEL_CONFIG,
  LEASE_TERMS,
  FinancialInputs,
} from '@/types/financial-model';
import { getAllMarkets } from '@/lib/financial-modeling';

interface InputsFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  isLoading?: boolean;
}

const buildingClasses: BuildingClass[] = ['A', 'B', 'C'];
const tiLevels: TILevel[] = ['low', 'mid', 'high'];
const markets = getAllMarkets();

export default function InputsForm({ inputs, onChange, isLoading }: InputsFormProps) {
  const handleBuildingClassChange = (buildingClass: BuildingClass) => {
    onChange({ ...inputs, building_class: buildingClass });
  };

  const handleLeaseTermChange = (leaseTerm: LeaseTerm) => {
    onChange({ ...inputs, lease_term: leaseTerm });
  };

  const handleTiLevelChange = (tiLevel: TILevel) => {
    onChange({ ...inputs, ti_level: tiLevel });
  };

  const handleMarketChange = (marketKey: string) => {
    onChange({ ...inputs, market_key: marketKey });
  };

  return (
    <div className={`space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Building Class */}
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
          Building Class
        </label>
        <div className="flex gap-2">
          {buildingClasses.map((cls) => {
            const config = BUILDING_CLASS_CONFIG[cls];
            const isSelected = inputs.building_class === cls;
            return (
              <button
                key={cls}
                onClick={() => handleBuildingClassChange(cls)}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
                title={config.description}
              >
                {config.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1.5">
          {BUILDING_CLASS_CONFIG[inputs.building_class].description}
        </p>
      </div>

      {/* Lease Term */}
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
          Lease Term
        </label>
        <div className="flex gap-2">
          {LEASE_TERMS.map((term) => {
            const isSelected = inputs.lease_term === term;
            return (
              <button
                key={term}
                onClick={() => handleLeaseTermChange(term)}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {term} years
              </button>
            );
          })}
        </div>
      </div>

      {/* TI Level */}
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
          Tenant Improvement Level
        </label>
        <div className="flex gap-2">
          {tiLevels.map((level) => {
            const config = TI_LEVEL_CONFIG[level];
            const isSelected = inputs.ti_level === level;
            return (
              <button
                key={level}
                onClick={() => handleTiLevelChange(level)}
                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
                title={config.description}
              >
                {config.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1.5">
          {TI_LEVEL_CONFIG[inputs.ti_level].description}
        </p>
      </div>

      {/* Market */}
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
          Market
        </label>
        <select
          value={inputs.market_key}
          onChange={(e) => handleMarketChange(e.target.value)}
          className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--border-accent)] transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {markets.map((market) => (
            <option key={market.key} value={market.key}>
              {market.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
