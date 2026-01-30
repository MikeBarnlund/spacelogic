'use client';

import { useMemo } from 'react';
import {
  CalculatedSpace,
  SpaceCategory,
  SpaceOverride,
  ScenarioKitOverrides,
  CATEGORY_CONFIG,
} from '@/types/kit-of-parts';
import EditableSpaceTypeRow from './EditableSpaceTypeRow';

interface EditableCategorySectionProps {
  category: SpaceCategory;
  spaces: CalculatedSpace[];
  overrides: ScenarioKitOverrides;
  onOverrideChange: (spaceKey: string, field: keyof SpaceOverride, value: number | undefined) => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function EditableCategorySection({
  category,
  spaces,
  overrides,
  onOverrideChange,
}: EditableCategorySectionProps) {
  const config = CATEGORY_CONFIG[category];

  // Filter spaces for this category
  const categorySpaces = useMemo(
    () => spaces.filter(s => s.category === category),
    [spaces, category]
  );

  // Calculate category totals with overrides applied
  const { categorySqft, categorySeats, categoryCount } = useMemo(() => {
    let sqft = 0;
    let seats = 0;
    let count = 0;

    for (const space of categorySpaces) {
      const override = overrides[space.space_type_key];
      const effectiveCount = override?.count ?? space.count;
      const effectiveSqftPerUnit = override?.sqft_per_unit ?? space.sqft_per_unit;
      const effectiveCapacityPerUnit = override?.capacity_per_unit ?? space.capacity_per_unit;

      count += effectiveCount;
      sqft += effectiveCount * effectiveSqftPerUnit;
      seats += effectiveCount * effectiveCapacityPerUnit;
    }

    return { categorySqft: sqft, categorySeats: seats, categoryCount: count };
  }, [categorySpaces, overrides]);

  if (categorySpaces.length === 0) {
    return null;
  }

  return (
    <div className="card overflow-hidden">
      {/* Category Header */}
      <div
        className="px-5 py-4 border-b border-[var(--border)]"
        style={{ backgroundColor: config.bgColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="text-base font-semibold" style={{ color: config.color }}>
              {config.label}
            </h3>
            <span className="text-sm text-[var(--text-muted)]">
              ({categorySpaces.length} {categorySpaces.length === 1 ? 'type' : 'types'})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {categoryCount}
              </div>
              <div className="text-xs text-[var(--text-muted)]">spaces</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {formatNumber(categorySqft)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">sqft</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {categorySeats}
              </div>
              <div className="text-xs text-[var(--text-muted)]">seats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-5 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] uppercase tracking-wider">
          <div className="flex-1">Space Type</div>
          <div className="w-16 text-center">Qty</div>
          <div className="w-16 text-center">Sqft/Unit</div>
          <div className="w-14 text-center">Cap/Unit</div>
          <div className="w-20 text-right">Total Sqft</div>
          <div className="w-16 text-right">Seats</div>
        </div>
      </div>

      {/* Space Types List */}
      <div className="px-5">
        {categorySpaces.map((space) => (
          <EditableSpaceTypeRow
            key={space.space_type_key}
            space={space}
            overrides={overrides[space.space_type_key]}
            onOverrideChange={(field, value) =>
              onOverrideChange(space.space_type_key, field, value)
            }
          />
        ))}
      </div>
    </div>
  );
}
