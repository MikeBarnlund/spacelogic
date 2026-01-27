import { SpaceType } from '@/types/kit-of-parts';

/**
 * Default space types with ratios for each workstyle preset.
 *
 * Ratio interpretation:
 * - per_workpoint: ratio = spaces per workpoint (concentration category)
 * - per_headcount: ratio = spaces per headcount (all other categories)
 *
 * Example: For 100 headcount with moderate preset (workpoints = 53):
 * - Workstation with ratio 0.4 per_workpoint = 53 * 0.4 = 21 workstations
 * - Small Meeting Room with ratio 0.05 per_headcount = 100 * 0.05 = 5 rooms
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

  {
    space_type_key: 'office_executive_quiet_room',
    space_type_name: 'Office (executive quiet room)',
    category: 'concentration',
    typical_sqft: 120,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.20,
    moderate_ratio: 0.05,
    progressive_ratio: 0.00,
    display_order: 10,
    is_active: true,
  },
  {
    space_type_key: 'workstations_assigned',
    space_type_name: 'Workstations (Assigned)',
    category: 'concentration',
    typical_sqft: 54,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.70,
    moderate_ratio: 0.40,
    progressive_ratio: 0.00,
    display_order: 20,
    is_active: true,
  },
  {
    space_type_key: 'workstations_bookable',
    space_type_name: 'Workstations (Bookable)',
    category: 'concentration',
    typical_sqft: 54,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.00,
    moderate_ratio: 0.30,
    progressive_ratio: 0.15,
    display_order: 30,
    is_active: true,
  },
  {
    space_type_key: 'workstations_benching',
    space_type_name: 'Workstations (Benching)',
    category: 'concentration',
    typical_sqft: 40,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.00,
    moderate_ratio: 0.10,
    progressive_ratio: 0.52,
    display_order: 40,
    is_active: true,
  },
  {
    space_type_key: 'focus_rooms_2_3pp',
    space_type_name: 'Focus Rooms 2-3pp',
    category: 'concentration',
    typical_sqft: 120,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.02,
    moderate_ratio: 0.05,
    progressive_ratio: 0.10,
    display_order: 50,
    is_active: true,
  },
  {
    space_type_key: 'quiet_rooms_1_person',
    space_type_name: 'Quiet Rooms 1 person',
    category: 'concentration',
    typical_sqft: 85,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.06,
    moderate_ratio: 0.10,
    progressive_ratio: 0.20,
    display_order: 60,
    is_active: true,
  },
  {
    space_type_key: 'phone_rooms',
    space_type_name: 'Phone Rooms',
    category: 'concentration',
    typical_sqft: 38,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.00,
    moderate_ratio: 0.00,
    progressive_ratio: 0.00,
    display_order: 70,
    is_active: true,
  },
  {
    space_type_key: 'phone_booth',
    space_type_name: 'Phone Booth',
    category: 'concentration',
    typical_sqft: 10,
    capacity: 1,
    ratio_basis: 'per_workpoint',
    traditional_ratio: 0.02,
    moderate_ratio: 0.00,
    progressive_ratio: 0.03,
    display_order: 80,
    is_active: true,
  },

  // ============================================
  // COLLABORATION (calculated per headcount)
  // Ratios converted from "1:X" to decimal (1/X)
  // ============================================

  {
    space_type_key: 'small_meeting_rooms',
    space_type_name: 'Small Meeting Rooms',
    category: 'collaboration',
    typical_sqft: 120,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 30,   // 1:30
    moderate_ratio: 1 / 20,      // 1:20
    progressive_ratio: 1 / 25,   // 1:25
    display_order: 100,
    is_active: true,
  },
  {
    space_type_key: 'dedicated_interview_rooms',
    space_type_name: 'Dedicated Interview Rooms',
    category: 'collaboration',
    typical_sqft: 120,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 150,     // 1:150
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 110,
    is_active: true,
  },
  {
    space_type_key: 'medium_meeting_rooms',
    space_type_name: 'Medium Meeting Rooms',
    category: 'collaboration',
    typical_sqft: 200,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 30,   // 1:30
    moderate_ratio: 1 / 25,      // 1:25
    progressive_ratio: 1 / 25,   // 1:25
    display_order: 120,
    is_active: true,
  },
  {
    space_type_key: 'large_meeting_rooms',
    space_type_name: 'Large Meeting Rooms',
    category: 'collaboration',
    typical_sqft: 300,
    capacity: 12,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 30,   // 1:30
    moderate_ratio: 1 / 40,      // 1:40
    progressive_ratio: 1 / 50,   // 1:50
    display_order: 130,
    is_active: true,
  },
  {
    space_type_key: 'board_room_support_space',
    space_type_name: 'Board Room & Support Space',
    category: 'collaboration',
    typical_sqft: 500,
    capacity: 20,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 140,
    is_active: true,
  },
  {
    space_type_key: 'conference_room_20_plus',
    space_type_name: 'Conference Room (20+ person)',
    category: 'collaboration',
    typical_sqft: 1200,
    capacity: 20,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 150,
    is_active: true,
  },
  {
    space_type_key: 'training_room',
    space_type_name: 'Training Room',
    category: 'collaboration',
    typical_sqft: 850,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 150,     // 1:150
    progressive_ratio: 1 / 250,  // 1:250
    display_order: 160,
    is_active: true,
  },
  {
    space_type_key: 'project_room',
    space_type_name: 'Project Room',
    category: 'collaboration',
    typical_sqft: 200,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 30,   // 1:30
    moderate_ratio: 1 / 40,      // 1:40
    progressive_ratio: 1 / 50,   // 1:50
    display_order: 170,
    is_active: true,
  },
  {
    space_type_key: 'standing_meeting_points',
    space_type_name: 'Standing Meeting Points',
    category: 'collaboration',
    typical_sqft: 90,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 25,   // 1:25
    moderate_ratio: 1 / 30,      // 1:30
    progressive_ratio: 1 / 40,   // 1:40
    display_order: 180,
    is_active: true,
  },
  {
    space_type_key: 'communal_tables',
    space_type_name: 'Communal Tables',
    category: 'collaboration',
    typical_sqft: 100,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 50,   // 1:50
    moderate_ratio: 1 / 80,      // 1:80
    progressive_ratio: 1 / 100,  // 1:100
    display_order: 190,
    is_active: true,
  },
  {
    space_type_key: 'open_collaboration_huddle_areas',
    space_type_name: 'Open Collaboration / Huddle Areas',
    category: 'collaboration',
    typical_sqft: 150,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 50,   // 1:50
    moderate_ratio: 1 / 50,      // 1:50
    progressive_ratio: 1 / 60,   // 1:60
    display_order: 200,
    is_active: true,
  },
  {
    space_type_key: 'closed_huddle_room',
    space_type_name: 'Closed Huddle Room',
    category: 'collaboration',
    typical_sqft: 215,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 50,   // 1:50
    moderate_ratio: 1 / 50,      // 1:50
    progressive_ratio: 1 / 60,   // 1:60
    display_order: 210,
    is_active: true,
  },
  {
    space_type_key: 'library',
    space_type_name: 'Library',
    category: 'collaboration',
    typical_sqft: 300,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 500,     // 1:500
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 220,
    is_active: true,
  },
  {
    space_type_key: 'open_seating',
    space_type_name: 'Open Seating',
    category: 'collaboration',
    typical_sqft: 40,
    capacity: 1,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 20,   // 1:20
    moderate_ratio: 1 / 30,      // 1:30
    progressive_ratio: 1 / 40,   // 1:40
    display_order: 230,
    is_active: true,
  },
  {
    space_type_key: 'chat_booths',
    space_type_name: 'Chat Booths',
    category: 'collaboration',
    typical_sqft: 40,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 40,   // 1:40
    moderate_ratio: 1 / 30,      // 1:30
    progressive_ratio: 1 / 40,   // 1:40
    display_order: 240,
    is_active: true,
  },

  // ============================================
  // SOCIALIZATION (calculated per headcount)
  // Ratios converted from "1:X" to decimal (1/X)
  // ============================================

  {
    space_type_key: 'pantry_small',
    space_type_name: 'Pantry - small',
    category: 'socialization',
    typical_sqft: 150,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 5000, // 1:5000
    moderate_ratio: 1 / 5000,    // 1:5000
    progressive_ratio: 1 / 5000, // 1:5000
    display_order: 300,
    is_active: true,
  },
  {
    space_type_key: 'pantry_medium',
    space_type_name: 'Pantry - medium',
    category: 'socialization',
    typical_sqft: 250,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 200,  // 1:200
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 310,
    is_active: true,
  },
  {
    space_type_key: 'pantry_large',
    space_type_name: 'Pantry - large',
    category: 'socialization',
    typical_sqft: 400,
    capacity: 16,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 2000, // 1:2000
    moderate_ratio: 1 / 2000,    // 1:2000
    progressive_ratio: 1 / 2000, // 1:2000
    display_order: 320,
    is_active: true,
  },
  {
    space_type_key: 'cafeteria',
    space_type_name: 'Cafeteria',
    category: 'socialization',
    typical_sqft: 500,
    capacity: 25,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 2000, // 1:2000
    moderate_ratio: 1 / 2000,    // 1:2000
    progressive_ratio: 1 / 2000, // 1:2000
    display_order: 330,
    is_active: true,
  },
  {
    space_type_key: 'auditorium',
    space_type_name: 'Auditorium',
    category: 'socialization',
    typical_sqft: 1500,
    capacity: 30,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 1000, // 1:1000
    moderate_ratio: 1 / 1000,    // 1:1000
    progressive_ratio: 1 / 1000, // 1:1000
    display_order: 340,
    is_active: true,
  },
  {
    space_type_key: 'work_lounge',
    space_type_name: 'Work Lounge',
    category: 'socialization',
    typical_sqft: 300,
    capacity: 12,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 350,
    is_active: true,
  },
  {
    space_type_key: 'reception_waiting_area_small',
    space_type_name: 'Reception & Waiting Area - small',
    category: 'socialization',
    typical_sqft: 225,
    capacity: 4,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0,
    moderate_ratio: 0,
    progressive_ratio: 0,
    display_order: 360,
    is_active: true,
  },
  {
    space_type_key: 'reception_waiting_area_medium',
    space_type_name: 'Reception & Waiting Area - medium',
    category: 'socialization',
    typical_sqft: 400,
    capacity: 6,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0,
    moderate_ratio: 0,
    progressive_ratio: 0,
    display_order: 370,
    is_active: true,
  },
  {
    space_type_key: 'reception_waiting_area_large',
    space_type_name: 'Reception & Waiting Area - large',
    category: 'socialization',
    typical_sqft: 625,
    capacity: 8,
    ratio_basis: 'per_headcount',
    traditional_ratio: 0,
    moderate_ratio: 0,
    progressive_ratio: 0,
    display_order: 380,
    is_active: true,
  },
  {
    space_type_key: 'wellness_space_meditation_room',
    space_type_name: 'Wellness Space (Meditation Room)',
    category: 'socialization',
    typical_sqft: 200,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 50,   // 1:50
    moderate_ratio: 1 / 50,      // 1:50
    progressive_ratio: 1 / 50,   // 1:50
    display_order: 390,
    is_active: true,
  },
  {
    space_type_key: 'gym',
    space_type_name: 'Gym',
    category: 'socialization',
    typical_sqft: 300,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 100,     // 1:100
    progressive_ratio: 1 / 100,  // 1:100
    display_order: 400,
    is_active: true,
  },
  {
    space_type_key: 'genius_bar_tech_service_centre',
    space_type_name: 'Genius Bar | Tech Service Centre',
    category: 'socialization',
    typical_sqft: 300,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 300,  // 1:300
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 410,
    is_active: true,
  },
  {
    space_type_key: 'games_area',
    space_type_name: 'Games Area',
    category: 'socialization',
    typical_sqft: 300,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 250,  // 1:250
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 200,  // 1:200
    display_order: 420,
    is_active: true,
  },

  // ============================================
  // AMENITY (calculated per headcount)
  // Ratios converted from "1:X" to decimal (1/X)
  // ============================================

  {
    space_type_key: '3h_storage',
    space_type_name: '3H Storage',
    category: 'amenity',
    typical_sqft: 4.5,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 10,   // 1:10
    moderate_ratio: 1 / 20,      // 1:20
    progressive_ratio: 1 / 50,   // 1:50
    display_order: 500,
    is_active: true,
  },
  {
    space_type_key: 'print_copy_rooms',
    space_type_name: 'Print / Copy Rooms',
    category: 'amenity',
    typical_sqft: 100,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 200,  // 1:200
    moderate_ratio: 1 / 300,     // 1:300
    progressive_ratio: 1 / 400,  // 1:400
    display_order: 510,
    is_active: true,
  },
  {
    space_type_key: 'storage_general',
    space_type_name: 'Storage General',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 100,  // 1:100
    moderate_ratio: 1 / 125,     // 1:125
    progressive_ratio: 1 / 150,  // 1:150
    display_order: 520,
    is_active: true,
  },
  {
    space_type_key: 'mail_room',
    space_type_name: 'Mail Room',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 2,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 2000, // 1:2000
    moderate_ratio: 1 / 2000,    // 1:2000
    progressive_ratio: 1 / 2000, // 1:2000
    display_order: 530,
    is_active: true,
  },
  {
    space_type_key: 'secure_storage_file',
    space_type_name: 'Secure Storage (File)',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 500,     // 1:500
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 540,
    is_active: true,
  },
  {
    space_type_key: 'lan_room',
    space_type_name: 'LAN room',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 500,     // 1:500
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 550,
    is_active: true,
  },
  {
    space_type_key: 'it_lab_workshop',
    space_type_name: 'IT LAB | Workshop',
    category: 'amenity',
    typical_sqft: 300,
    capacity: 5,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 500,     // 1:500
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 560,
    is_active: true,
  },
  {
    space_type_key: 'it_secure_storage',
    space_type_name: 'IT Secure Storage',
    category: 'amenity',
    typical_sqft: 120,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 300,  // 1:300
    moderate_ratio: 1 / 300,     // 1:300
    progressive_ratio: 1 / 300,  // 1:300
    display_order: 570,
    is_active: true,
  },
  {
    space_type_key: 'lab_specialty_space',
    space_type_name: 'Lab | Specialty Space',
    category: 'amenity',
    typical_sqft: 600,
    capacity: 5,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 500,     // 1:500
    progressive_ratio: 1 / 500,  // 1:500
    display_order: 580,
    is_active: true,
  },
  {
    space_type_key: 'lockers_coat_closets',
    space_type_name: 'Lockers / Coat Closets',
    category: 'amenity',
    typical_sqft: 130,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 500,  // 1:500
    moderate_ratio: 1 / 200,     // 1:200
    progressive_ratio: 1 / 150,  // 1:150
    display_order: 590,
    is_active: true,
  },
  {
    space_type_key: 'gender_washrooms',
    space_type_name: 'Gender Washrooms',
    category: 'amenity',
    typical_sqft: 140,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 50,   // 1:50
    moderate_ratio: 1 / 50,      // 1:50
    progressive_ratio: 1 / 50,   // 1:50
    display_order: 600,
    is_active: true,
  },
  {
    space_type_key: 'mothers_room_first_aid',
    space_type_name: "Mother's Room/First Aid",
    category: 'amenity',
    typical_sqft: 120,
    capacity: 0,
    ratio_basis: 'per_headcount',
    traditional_ratio: 1 / 2000, // 1:2000
    moderate_ratio: 1 / 2000,    // 1:2000
    progressive_ratio: 1 / 2000, // 1:2000
    display_order: 610,
    is_active: true,
  },
];

/**
 * Get the default space types (for use when no custom ratios are configured)
 */
export function getDefaultSpaceTypes(): SpaceType[] {
  return DEFAULT_SPACE_TYPES;
}
