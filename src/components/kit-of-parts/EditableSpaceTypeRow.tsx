'use client';

import { CalculatedSpace, SpaceOverride } from '@/types/kit-of-parts';

interface EditableSpaceTypeRowProps {
  space: CalculatedSpace;
  overrides?: SpaceOverride;
  onOverrideChange: (field: keyof SpaceOverride, value: number | undefined) => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function EditableSpaceTypeRow({
  space,
  overrides,
  onOverrideChange,
}: EditableSpaceTypeRowProps) {
  // Get effective values (override or original)
  const effectiveCount = overrides?.count ?? space.count;
  const effectiveSqftPerUnit = overrides?.sqft_per_unit ?? space.sqft_per_unit;
  const effectiveCapacityPerUnit = overrides?.capacity_per_unit ?? space.capacity_per_unit;

  // Calculate derived totals
  const totalSqft = effectiveCount * effectiveSqftPerUnit;
  const totalCapacity = effectiveCount * effectiveCapacityPerUnit;

  // Check if fields are overridden
  const isCountOverridden = overrides?.count !== undefined;
  const isSqftOverridden = overrides?.sqft_per_unit !== undefined;
  const isCapacityOverridden = overrides?.capacity_per_unit !== undefined;

  const handleInputChange = (
    field: keyof SpaceOverride,
    value: string,
    originalValue: number
  ) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }
    // If value matches original, clear the override
    if (numValue === originalValue) {
      onOverrideChange(field, undefined);
    } else {
      onOverrideChange(field, numValue);
    }
  };

  const inputBaseClass = 'w-14 px-1.5 py-1 text-sm font-medium text-center bg-[var(--bg-secondary)] border rounded text-[var(--text-primary)] mono focus:outline-none focus:border-[var(--border-accent)] transition-colors';
  const inputOverriddenClass = 'border-[var(--warning)] bg-[var(--warning-muted)]';
  const inputNormalClass = 'border-[var(--border)]';

  return (
    <div className="flex items-center py-3 border-b border-[var(--border)] last:border-0 gap-2">
      {/* Space Name */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
          {space.space_type_name}
        </div>
      </div>

      {/* Count Input */}
      <div className="w-16 text-center">
        <input
          type="number"
          min="0"
          value={effectiveCount}
          onChange={(e) => handleInputChange('count', e.target.value, space.count)}
          className={`${inputBaseClass} ${isCountOverridden ? inputOverriddenClass : inputNormalClass}`}
          title={isCountOverridden ? `Default: ${space.count}` : undefined}
        />
        <div className="text-xs text-[var(--text-muted)] mt-0.5">qty</div>
      </div>

      {/* Sqft/Unit Input */}
      <div className="w-16 text-center">
        <input
          type="number"
          min="0"
          value={effectiveSqftPerUnit}
          onChange={(e) => handleInputChange('sqft_per_unit', e.target.value, space.sqft_per_unit)}
          className={`${inputBaseClass} ${isSqftOverridden ? inputOverriddenClass : inputNormalClass}`}
          title={isSqftOverridden ? `Default: ${space.sqft_per_unit}` : undefined}
        />
        <div className="text-xs text-[var(--text-muted)] mt-0.5">sqft</div>
      </div>

      {/* Capacity/Unit Input */}
      <div className="w-14 text-center">
        <input
          type="number"
          min="0"
          value={effectiveCapacityPerUnit}
          onChange={(e) => handleInputChange('capacity_per_unit', e.target.value, space.capacity_per_unit)}
          className={`${inputBaseClass} ${isCapacityOverridden ? inputOverriddenClass : inputNormalClass}`}
          title={isCapacityOverridden ? `Default: ${space.capacity_per_unit}` : undefined}
        />
        <div className="text-xs text-[var(--text-muted)] mt-0.5">cap</div>
      </div>

      {/* Total Sqft (calculated, read-only) */}
      <div className="w-20 text-right">
        <div className="text-sm font-medium text-[var(--text-primary)] mono">
          {formatNumber(totalSqft)}
        </div>
        <div className="text-xs text-[var(--text-muted)]">total sqft</div>
      </div>

      {/* Total Capacity (calculated, read-only) */}
      <div className="w-16 text-right">
        <div className="text-sm font-medium text-[var(--text-primary)] mono">
          {totalCapacity}
        </div>
        <div className="text-xs text-[var(--text-muted)]">seats</div>
      </div>
    </div>
  );
}
