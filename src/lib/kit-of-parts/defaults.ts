import { SpaceType } from '@/types/kit-of-parts';

/**
 * Default space types with ratios for each workstyle preset.
 *
 * Ratio interpretation:
 * - per_workpoint: ratio = spaces per workpoint (concentration category)
 * - per_headcount: ratio = spaces per headcount (all other categories)
 *
 * Example: For 100 headcount with moderate preset (workpoints = 53):
 * - Workstation with ratio 0.6 per_workpoint = 53 * 0.6 = 32 workstations
 * - Huddle Room with ratio 0.05 per_headcount = 100 * 0.05 = 5 huddle rooms
 *
 * Ratios are tuned so that:
 * - Traditional: More private spaces, dedicated desks, spacious
 * - Moderate: Balanced mix of shared and dedicated
 * - Progressive: More sharing, activity-based, efficient
 */
export const DEFAULT_SPACE_TYPES: SpaceType[] = [
  // ============================================
  // CONCENTRATION (calculated per workpoint)
  // ============================================

  // Private Offices
  {
    space_type_key: 'private_office_large',
    space_type_name: 'Private Office (Large)',
    category: 'concentration',
    typical_sqft: 200,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.15,  // 15% of workpoints get large offices
    moderate_ratio: 0.05,
    progressive_ratio: 0.02,
    display_order: 10,
    is_active: true,
  },
  {
    space_type_key: 'private_office_standard',
    space_type_name: 'Private Office (Standard)',
    category: 'concentration',
    typical_sqft: 120,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.20,
    moderate_ratio: 0.10,
    progressive_ratio: 0.03,
    display_order: 20,
    is_active: true,
  },

  // Focus Rooms
  {
    space_type_key: 'focus_room',
    space_type_name: 'Focus Room',
    category: 'concentration',
    typical_sqft: 80,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.05,
    moderate_ratio: 0.10,
    progressive_ratio: 0.15,
    display_order: 30,
    is_active: true,
  },

  // Workstations
  {
    space_type_key: 'workstation_dedicated',
    space_type_name: 'Dedicated Workstation',
    category: 'concentration',
    typical_sqft: 64,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.50,
    moderate_ratio: 0.35,
    progressive_ratio: 0.10,
    display_order: 40,
    is_active: true,
  },
  {
    space_type_key: 'workstation_shared',
    space_type_name: 'Shared Workstation',
    category: 'concentration',
    typical_sqft: 48,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.05,
    moderate_ratio: 0.25,
    progressive_ratio: 0.40,
    display_order: 50,
    is_active: true,
  },

  // Benching
  {
    space_type_key: 'bench_desk',
    space_type_name: 'Bench Desk',
    category: 'concentration',
    typical_sqft: 36,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.00,
    moderate_ratio: 0.10,
    progressive_ratio: 0.25,
    display_order: 60,
    is_active: true,
  },

  // Phone Booths
  {
    space_type_key: 'phone_booth',
    space_type_name: 'Phone Booth',
    category: 'concentration',
    typical_sqft: 25,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.03,
    moderate_ratio: 0.08,
    progressive_ratio: 0.12,
    display_order: 70,
    is_active: true,
  },

  // ============================================
  // COLLABORATION (calculated per headcount)
  // ============================================

  // Conference Rooms
  {
    space_type_key: 'conference_room_large',
    space_type_name: 'Large Conference Room (12+)',
    category: 'collaboration',
    typical_sqft: 400,
    capacity: 14,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.010,  // 1 per 100 people
    moderate_ratio: 0.008,
    progressive_ratio: 0.006,
    display_order: 100,
    is_active: true,
  },
  {
    space_type_key: 'conference_room_medium',
    space_type_name: 'Medium Conference Room (8-12)',
    category: 'collaboration',
    typical_sqft: 280,
    capacity: 10,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.020,  // 2 per 100 people
    moderate_ratio: 0.025,
    progressive_ratio: 0.020,
    display_order: 110,
    is_active: true,
  },
  {
    space_type_key: 'conference_room_small',
    space_type_name: 'Small Conference Room (4-6)',
    category: 'collaboration',
    typical_sqft: 150,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.030,
    moderate_ratio: 0.040,
    progressive_ratio: 0.035,
    display_order: 120,
    is_active: true,
  },

  // Huddle Rooms
  {
    space_type_key: 'huddle_room',
    space_type_name: 'Huddle Room (2-4)',
    category: 'collaboration',
    typical_sqft: 80,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.020,
    moderate_ratio: 0.050,
    progressive_ratio: 0.080,
    display_order: 130,
    is_active: true,
  },

  // Open Collaboration
  {
    space_type_key: 'collaboration_zone',
    space_type_name: 'Open Collaboration Zone',
    category: 'collaboration',
    typical_sqft: 200,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.015,
    progressive_ratio: 0.025,
    display_order: 140,
    is_active: true,
  },

  // Project Rooms
  {
    space_type_key: 'project_room',
    space_type_name: 'Project Room',
    category: 'collaboration',
    typical_sqft: 300,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.008,
    moderate_ratio: 0.010,
    progressive_ratio: 0.015,
    display_order: 150,
    is_active: true,
  },

  // Training Room
  {
    space_type_key: 'training_room',
    space_type_name: 'Training Room',
    category: 'collaboration',
    typical_sqft: 600,
    capacity: 20,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,  // 1 per 200 people
    moderate_ratio: 0.005,
    progressive_ratio: 0.008,
    display_order: 160,
    is_active: true,
  },

  // ============================================
  // SOCIALIZATION (calculated per headcount)
  // ============================================

  // Cafe / Break Areas
  {
    space_type_key: 'cafe_main',
    space_type_name: 'Main Cafe',
    category: 'socialization',
    typical_sqft: 800,
    capacity: 40,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,  // 1 per 200 people
    moderate_ratio: 0.006,
    progressive_ratio: 0.008,
    display_order: 200,
    is_active: true,
  },
  {
    space_type_key: 'coffee_bar',
    space_type_name: 'Coffee Bar / Micro Kitchen',
    category: 'socialization',
    typical_sqft: 150,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.010,
    moderate_ratio: 0.015,
    progressive_ratio: 0.020,
    display_order: 210,
    is_active: true,
  },

  // Lounges
  {
    space_type_key: 'lounge_area',
    space_type_name: 'Lounge Area',
    category: 'socialization',
    typical_sqft: 250,
    capacity: 10,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.010,
    progressive_ratio: 0.018,
    display_order: 220,
    is_active: true,
  },
  {
    space_type_key: 'quiet_lounge',
    space_type_name: 'Quiet Lounge',
    category: 'socialization',
    typical_sqft: 150,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.008,
    progressive_ratio: 0.012,
    display_order: 230,
    is_active: true,
  },

  // Game / Recreation
  {
    space_type_key: 'game_room',
    space_type_name: 'Game / Recreation Room',
    category: 'socialization',
    typical_sqft: 300,
    capacity: 10,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.002,
    moderate_ratio: 0.005,
    progressive_ratio: 0.008,
    display_order: 240,
    is_active: true,
  },

  // Outdoor
  {
    space_type_key: 'outdoor_terrace',
    space_type_name: 'Outdoor Terrace',
    category: 'socialization',
    typical_sqft: 400,
    capacity: 20,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.003,
    moderate_ratio: 0.004,
    progressive_ratio: 0.006,
    display_order: 250,
    is_active: true,
  },

  // ============================================
  // AMENITY (calculated per headcount)
  // ============================================

  // Reception
  {
    space_type_key: 'reception',
    space_type_name: 'Reception / Lobby',
    category: 'amenity',
    typical_sqft: 400,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.004,
    progressive_ratio: 0.003,
    display_order: 300,
    is_active: true,
  },

  // Wellness
  {
    space_type_key: 'wellness_room',
    space_type_name: 'Wellness / Mothers Room',
    category: 'amenity',
    typical_sqft: 80,
    capacity: 1,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.008,
    progressive_ratio: 0.012,
    display_order: 310,
    is_active: true,
  },
  {
    space_type_key: 'fitness_room',
    space_type_name: 'Fitness Room',
    category: 'amenity',
    typical_sqft: 500,
    capacity: 10,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.002,
    moderate_ratio: 0.003,
    progressive_ratio: 0.005,
    display_order: 320,
    is_active: true,
  },

  // Storage / Support
  {
    space_type_key: 'storage_personal',
    space_type_name: 'Personal Storage / Lockers',
    category: 'amenity',
    typical_sqft: 100,
    capacity: 20,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.003,
    moderate_ratio: 0.006,
    progressive_ratio: 0.010,
    display_order: 330,
    is_active: true,
  },
  {
    space_type_key: 'copy_print',
    space_type_name: 'Copy / Print Area',
    category: 'amenity',
    typical_sqft: 80,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.012,
    moderate_ratio: 0.008,
    progressive_ratio: 0.005,
    display_order: 340,
    is_active: true,
  },
  {
    space_type_key: 'mail_room',
    space_type_name: 'Mail Room',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.005,
    moderate_ratio: 0.004,
    progressive_ratio: 0.003,
    display_order: 350,
    is_active: true,
  },

  // IT / Tech
  {
    space_type_key: 'server_room',
    space_type_name: 'Server / IT Room',
    category: 'amenity',
    typical_sqft: 150,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.004,
    moderate_ratio: 0.003,
    progressive_ratio: 0.003,
    display_order: 360,
    is_active: true,
  },

  // Storage
  {
    space_type_key: 'general_storage',
    space_type_name: 'General Storage',
    category: 'amenity',
    typical_sqft: 150,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0.008,
    moderate_ratio: 0.006,
    progressive_ratio: 0.004,
    display_order: 370,
    is_active: true,
  },
];

/**
 * Get the default space types (for use when no custom ratios are configured)
 */
export function getDefaultSpaceTypes(): SpaceType[] {
  return DEFAULT_SPACE_TYPES;
}
