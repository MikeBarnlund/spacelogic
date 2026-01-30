'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  KitOfParts,
  SpaceCategory,
  SpaceOverride,
  ScenarioKitOverrides,
} from '@/types/kit-of-parts';
import { applyKitOverrides } from '@/lib/kit-of-parts';
import EditableCategorySection from './EditableCategorySection';
import TotalsSummary from './TotalsSummary';

interface KitOfPartsEditorProps {
  kit: KitOfParts;
  headcount: number;
  overrides: ScenarioKitOverrides | null;
  onOverridesChange: (overrides: ScenarioKitOverrides | null) => void;
  isSaving?: boolean;
}

const categories: SpaceCategory[] = ['concentration', 'collaboration', 'socialization', 'amenity'];

export default function KitOfPartsEditor({
  kit,
  headcount,
  overrides,
  onOverridesChange,
  isSaving,
}: KitOfPartsEditorProps) {
  // Local state for editing
  const [localOverrides, setLocalOverrides] = useState<ScenarioKitOverrides>(overrides || {});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with external overrides when they change
  useEffect(() => {
    setLocalOverrides(overrides || {});
    setHasChanges(false);
  }, [overrides]);

  // Apply overrides to get effective kit
  const effectiveKit = useMemo(
    () => applyKitOverrides(kit, localOverrides),
    [kit, localOverrides]
  );

  // Check if there are any saved overrides
  const hasOverrides = Object.keys(overrides || {}).length > 0;

  // Handle field change for a specific space
  const handleOverrideChange = (
    spaceKey: string,
    field: keyof SpaceOverride,
    value: number | undefined
  ) => {
    setLocalOverrides((prev) => {
      const newOverrides = { ...prev };

      if (value === undefined) {
        // Remove the field from the override
        if (newOverrides[spaceKey]) {
          const { [field]: _removed, ...rest } = newOverrides[spaceKey];
          void _removed; // Intentionally unused - destructuring to exclude
          if (Object.keys(rest).length === 0) {
            delete newOverrides[spaceKey];
          } else {
            newOverrides[spaceKey] = rest;
          }
        }
      } else {
        // Set the override value
        newOverrides[spaceKey] = {
          ...newOverrides[spaceKey],
          [field]: value,
        };
      }

      return newOverrides;
    });
    setHasChanges(true);
  };

  // Save changes
  const handleSave = () => {
    // Only save non-empty overrides
    const cleanedOverrides = Object.keys(localOverrides).length > 0 ? localOverrides : null;
    onOverridesChange(cleanedOverrides);
    setHasChanges(false);
  };

  // Reset to defaults
  const handleReset = () => {
    setLocalOverrides({});
    onOverridesChange(null);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasOverrides && (
            <span className="text-xs text-[var(--warning)] bg-[var(--warning-muted)] px-2 py-1 rounded font-medium">
              Customized
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
          {(hasOverrides || hasChanges) && (
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50"
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>

      {/* Category Sections */}
      {categories.map((category) => (
        <EditableCategorySection
          key={category}
          category={category}
          spaces={kit.spaces}
          overrides={localOverrides}
          onOverrideChange={handleOverrideChange}
        />
      ))}

      {/* Totals Summary */}
      <TotalsSummary kit={effectiveKit} headcount={headcount} />
    </div>
  );
}
