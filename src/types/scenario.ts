import { KitOfParts } from './kit-of-parts';
import { FinancialModel } from './financial-model';

// Workstyle distribution percentages (should sum to 100)
export interface WorkstyleDistribution {
  on_site: number;   // % working 4-5 days/week
  hybrid: number;    // % working 1-3 days/week
  remote: number;    // % working <1 day/week
}

// Calculated attendance metrics
export interface AttendanceMetrics {
  total_headcount: number;
  average_daily_attendance: number;
  peak_attendance: number;
}

// Cost range with low/mid/high values
export interface CostRange {
  low: number;
  mid: number;
  high: number;
}

export interface LayoutMix {
  private_offices: number;
  open_desks: number;
  conference_rooms: number;
  common_areas: number;
}

export interface Capacity {
  current: number;
  max: number;
}

export interface Scenario {
  scenario_name: string;
  scenario_type: 'traditional' | 'moderate' | 'progressive';
  total_sqft: number;
  sqft_per_person: number;
  seats_per_person: number;
  layout_mix: LayoutMix;
  kit_of_parts?: KitOfParts; // Detailed space breakdown (optional for backward compatibility)
  financial_model?: FinancialModel; // Financial modeling (optional)
  annual_cost_range: CostRange;
  cost_per_employee_range: CostRange;
  attendance_metrics: AttendanceMetrics;
  capacity: Capacity;
  pros: string[];
  cons: string[];
}

export interface ExtractedRequirements {
  current_headcount: number | null;
  growth_projection: string | null;
  is_reduction: boolean | null;  // true if downsizing, false if growing, null if no change
  workstyle_distribution: WorkstyleDistribution | null;
  location: string | null;
}

export interface GenerateScenariosRequest {
  input: string;
}

export interface GenerateScenariosResponse {
  scenarios: Scenario[];
  extracted_requirements: ExtractedRequirements;
}

// Constants for scenario calculations

// Scenario standards by type
export const SCENARIO_STANDARDS = {
  traditional: {
    sqft_per_person: 210,
    seats_per_person: 1.79,
    description: 'Dedicated desks, more private offices',
  },
  moderate: {
    sqft_per_person: 165,
    seats_per_person: 1.46,
    description: 'Mix of dedicated and shared',
  },
  progressive: {
    sqft_per_person: 143,
    seats_per_person: 1.14,
    description: 'Hot desking, activity-based working',
  },
} as const;

// Cost per sqft ranges
export const COST_PER_SQFT = {
  low: 120,
  mid: 250,
  high: 450,
} as const;

// Workstyle attendance factors
export const WORKSTYLE_ATTENDANCE = {
  on_site: 0.9,   // 90% daily attendance for 4-5 days/week workers
  hybrid: 0.4,    // 40% daily attendance for 1-3 days/week workers
  remote: 0.1,    // 10% daily attendance for <1 day/week workers
} as const;

// Peak attendance multiplier (25% buffer over average)
export const PEAK_ATTENDANCE_MULTIPLIER = 1.25;
