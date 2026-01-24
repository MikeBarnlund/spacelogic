import {
  SpaceType,
  SpaceCategory,
  WorkstylePreset,
  KitOfParts,
  KitOfPartsInput,
  CalculatedSpace,
  CategorySummary,
  WORKSTYLE_RATIOS,
} from '@/types/kit-of-parts';
import { LayoutMix } from '@/types/scenario';
import { getDefaultSpaceTypes } from './defaults';

/**
 * Calculate workpoints (concentration seats needed) from headcount and workstyle
 * Workpoints = headcount / employee_to_seat_ratio
 */
export function calculateWorkpoints(headcount: number, workstyle: WorkstylePreset): number {
  const ratio = WORKSTYLE_RATIOS[workstyle];
  return Math.round(headcount / ratio);
}

/**
 * Get the ratio for a space type based on workstyle preset
 */
function getSpaceRatio(spaceType: SpaceType, workstyle: WorkstylePreset): number {
  switch (workstyle) {
    case 'traditional':
      return spaceType.traditional_ratio;
    case 'moderate':
      return spaceType.moderate_ratio;
    case 'progressive':
      return spaceType.progressive_ratio;
    default:
      return spaceType.moderate_ratio;
  }
}

/**
 * Calculate the count of a space type based on workpoints or headcount
 */
function calculateSpaceCount(
  spaceType: SpaceType,
  workpoints: number,
  headcount: number,
  workstyle: WorkstylePreset
): number {
  const ratio = getSpaceRatio(spaceType, workstyle);

  if (ratio === 0) return 0;

  // Concentration spaces are calculated per workpoint
  // Other categories are calculated per headcount
  const basis = spaceType.ratio_basis === 'per_workpoint' ? workpoints : headcount;

  // Ratio represents "one space per X people/workpoints"
  // So count = basis / ratio
  const count = basis * ratio;

  // Round to nearest integer, minimum 0
  return Math.max(0, Math.round(count));
}

/**
 * Calculate the complete Kit of Parts for a scenario
 */
export function calculateKitOfParts(input: KitOfPartsInput): KitOfParts {
  const { headcount, workstyle_preset } = input;
  const spaceTypes = input.space_types || getDefaultSpaceTypes();

  // Calculate workpoints
  const workpoints = calculateWorkpoints(headcount, workstyle_preset);
  const employeeToSeatRatio = WORKSTYLE_RATIOS[workstyle_preset];

  // Calculate each space type
  const spaces: CalculatedSpace[] = [];

  // Filter to active space types and sort by display order
  const activeSpaceTypes = spaceTypes
    .filter(st => st.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  for (const spaceType of activeSpaceTypes) {
    const count = calculateSpaceCount(spaceType, workpoints, headcount, workstyle_preset);

    // Skip if count is 0
    if (count === 0) continue;

    const totalSqft = count * spaceType.typical_sqft;
    const totalCapacity = count * spaceType.capacity;

    spaces.push({
      space_type_key: spaceType.space_type_key,
      space_type_name: spaceType.space_type_name,
      category: spaceType.category,
      count,
      sqft_per_unit: spaceType.typical_sqft,
      total_sqft: totalSqft,
      capacity_per_unit: spaceType.capacity,
      total_capacity: totalCapacity,
    });
  }

  // Calculate category summaries
  const categorySummary = calculateCategorySummary(spaces);

  // Calculate totals
  const totalSpaces = spaces.reduce((sum, s) => sum + s.count, 0);
  const totalUsableSqft = spaces.reduce((sum, s) => sum + s.total_sqft, 0);
  const totalSeats = spaces.reduce((sum, s) => sum + s.total_capacity, 0);

  return {
    workpoints,
    employee_to_seat_ratio: employeeToSeatRatio,
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
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  }

  return summary;
}

/**
 * Generate backward-compatible LayoutMix from Kit of Parts
 * Maps the detailed spaces back to the simple 4-item layout
 */
export function generateLayoutMixFromKitOfParts(kit: KitOfParts): LayoutMix {
  // Count private offices (concentration spaces that are enclosed)
  const privateOffices = kit.spaces
    .filter(s => s.category === 'concentration' &&
      (s.space_type_key.includes('office') || s.space_type_key.includes('focus_room')))
    .reduce((sum, s) => sum + s.count, 0);

  // Count open desks (concentration spaces that are open)
  const openDesks = kit.spaces
    .filter(s => s.category === 'concentration' &&
      (s.space_type_key.includes('workstation') || s.space_type_key.includes('desk') || s.space_type_key.includes('bench')))
    .reduce((sum, s) => sum + s.count, 0);

  // Count conference rooms (collaboration spaces)
  const conferenceRooms = kit.spaces
    .filter(s => s.category === 'collaboration')
    .reduce((sum, s) => sum + s.count, 0);

  // Sum common areas sqft (socialization + amenity)
  const commonAreas = kit.spaces
    .filter(s => s.category === 'socialization' || s.category === 'amenity')
    .reduce((sum, s) => sum + s.total_sqft, 0);

  return {
    private_offices: privateOffices,
    open_desks: openDesks,
    conference_rooms: conferenceRooms,
    common_areas: commonAreas,
  };
}

/**
 * Calculate Kit of Parts for all three scenario types
 */
export function calculateAllScenarios(headcount: number, spaceTypes?: SpaceType[]): Record<WorkstylePreset, KitOfParts> {
  const presets: WorkstylePreset[] = ['traditional', 'moderate', 'progressive'];

  const results: Record<WorkstylePreset, KitOfParts> = {} as Record<WorkstylePreset, KitOfParts>;

  for (const preset of presets) {
    results[preset] = calculateKitOfParts({
      headcount,
      workstyle_preset: preset,
      space_types: spaceTypes,
    });
  }

  return results;
}
