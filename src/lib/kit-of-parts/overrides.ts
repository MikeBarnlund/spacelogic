import {
  KitOfParts,
  CalculatedSpace,
  SpaceCategory,
  CategorySummary,
  ScenarioKitOverrides,
  SpaceOverride,
} from '@/types/kit-of-parts';

/**
 * Apply overrides to a Kit of Parts and recalculate totals
 * Returns a new KitOfParts with overrides applied
 */
export function applyKitOverrides(
  kit: KitOfParts,
  overrides: ScenarioKitOverrides | null | undefined
): KitOfParts {
  if (!overrides || Object.keys(overrides).length === 0) {
    return kit;
  }

  // Apply overrides to each space
  const spaces: CalculatedSpace[] = kit.spaces.map((space) => {
    const override = overrides[space.space_type_key];
    if (!override) {
      return space;
    }

    const count = override.count ?? space.count;
    const sqftPerUnit = override.sqft_per_unit ?? space.sqft_per_unit;
    const capacityPerUnit = override.capacity_per_unit ?? space.capacity_per_unit;

    return {
      ...space,
      count,
      sqft_per_unit: sqftPerUnit,
      capacity_per_unit: capacityPerUnit,
      total_sqft: count * sqftPerUnit,
      total_capacity: count * capacityPerUnit,
    };
  });

  // Recalculate category summaries
  const categorySummary = calculateCategorySummary(spaces);

  // Recalculate totals
  const totalSpaces = spaces.reduce((sum, s) => sum + s.count, 0);
  const totalUsableSqft = spaces.reduce((sum, s) => sum + s.total_sqft, 0);
  const totalSeats = spaces.reduce((sum, s) => sum + s.total_capacity, 0);

  return {
    ...kit,
    spaces,
    category_summary: categorySummary,
    total_spaces: totalSpaces,
    total_usable_sqft: totalUsableSqft,
    total_seats: totalSeats,
  };
}

/**
 * Calculate summary statistics for each category
 */
function calculateCategorySummary(spaces: CalculatedSpace[]): Record<SpaceCategory, CategorySummary> {
  const categories: SpaceCategory[] = ['concentration', 'collaboration', 'socialization', 'amenity'];
  const totalSqft = spaces.reduce((sum, s) => sum + s.total_sqft, 0);

  const summary: Record<SpaceCategory, CategorySummary> = {} as Record<SpaceCategory, CategorySummary>;

  for (const category of categories) {
    const categorySpaces = spaces.filter(s => s.category === category);
    const count = categorySpaces.reduce((sum, s) => sum + s.count, 0);
    const sqft = categorySpaces.reduce((sum, s) => sum + s.total_sqft, 0);
    const percentage = totalSqft > 0 ? (sqft / totalSqft) * 100 : 0;

    summary[category] = {
      count,
      total_sqft: sqft,
      percentage: Math.round(percentage * 10) / 10,
    };
  }

  return summary;
}

/**
 * Check if a space has any overrides applied
 */
export function hasSpaceOverride(
  spaceKey: string,
  overrides: ScenarioKitOverrides | null | undefined
): boolean {
  if (!overrides) return false;
  const override = overrides[spaceKey];
  if (!override) return false;
  return (
    override.count !== undefined ||
    override.sqft_per_unit !== undefined ||
    override.capacity_per_unit !== undefined
  );
}

/**
 * Get the effective value for a space field, considering overrides
 */
export function getEffectiveSpaceValue(
  space: CalculatedSpace,
  field: keyof SpaceOverride,
  overrides: ScenarioKitOverrides | null | undefined
): number {
  const override = overrides?.[space.space_type_key];
  if (override && override[field] !== undefined) {
    return override[field]!;
  }

  switch (field) {
    case 'count':
      return space.count;
    case 'sqft_per_unit':
      return space.sqft_per_unit;
    case 'capacity_per_unit':
      return space.capacity_per_unit;
  }
}

/**
 * Check if a specific field has an override
 */
export function isFieldOverridden(
  spaceKey: string,
  field: keyof SpaceOverride,
  overrides: ScenarioKitOverrides | null | undefined
): boolean {
  if (!overrides) return false;
  const override = overrides[spaceKey];
  return override?.[field] !== undefined;
}
