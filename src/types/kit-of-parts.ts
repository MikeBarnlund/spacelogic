// Space category types
export type SpaceCategory = 'concentration' | 'collaboration' | 'socialization' | 'amenity';

// Ratio basis determines how counts are calculated
export type RatioBasis = 'per_workpoint' | 'per_headcount';

// Workstyle presets and their employee-to-concentration-seat ratios
export type WorkstylePreset = 'traditional' | 'moderate' | 'progressive';

// Employee-to-Concentration-Seat Ratios
// Traditional: 1.4 = More dedicated seats (lower ratio = more seats per employee)
// Moderate: 1.89 = Balanced sharing
// Progressive: 2.60 = More seat sharing (higher ratio = fewer seats per employee)
export const WORKSTYLE_RATIOS: Record<WorkstylePreset, number> = {
  traditional: 1.4,
  moderate: 1.89,
  progressive: 2.60,
} as const;

// Space type definition with ratios for each workstyle
export interface SpaceType {
  space_type_key: string;
  space_type_name: string;
  category: SpaceCategory;
  typical_sqft: number;
  capacity: number;
  ratio_basis: RatioBasis;
  // Ratios: how many of this space type per workpoint or headcount
  traditional_ratio: number;
  moderate_ratio: number;
  progressive_ratio: number;
  display_order: number;
  is_active: boolean;
}

// Calculated space for a specific scenario
export interface CalculatedSpace {
  space_type_key: string;
  space_type_name: string;
  category: SpaceCategory;
  count: number;
  sqft_per_unit: number;
  total_sqft: number;
  capacity_per_unit: number;
  total_capacity: number;
}

// Summary stats for a category
export interface CategorySummary {
  count: number;
  total_sqft: number;
  percentage: number;
}

// Complete Kit of Parts for a scenario
export interface KitOfParts {
  workpoints: number;
  employee_to_seat_ratio: number;
  spaces: CalculatedSpace[];
  category_summary: Record<SpaceCategory, CategorySummary>;
  total_spaces: number;
  total_usable_sqft: number;
  total_seats: number;
}

// Input for calculating Kit of Parts
export interface KitOfPartsInput {
  headcount: number;
  workstyle_preset: WorkstylePreset;
  space_types?: SpaceType[]; // Optional custom ratios, uses defaults if not provided
}

// Configuration stored at project level (custom spatial ratios)
export interface SpatialRatiosConfig {
  space_types: SpaceType[];
  last_updated: string;
}

// Category display configuration
export const CATEGORY_CONFIG: Record<SpaceCategory, { label: string; color: string; bgColor: string }> = {
  concentration: {
    label: 'Concentration',
    color: 'var(--traditional)',
    bgColor: 'var(--traditional-bg)',
  },
  collaboration: {
    label: 'Collaboration',
    color: 'var(--moderate)',
    bgColor: 'var(--moderate-bg)',
  },
  socialization: {
    label: 'Socialization',
    color: 'var(--progressive)',
    bgColor: 'var(--progressive-bg)',
  },
  amenity: {
    label: 'Amenity',
    color: 'var(--text-muted)',
    bgColor: 'var(--bg-secondary)',
  },
} as const;
